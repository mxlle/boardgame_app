import {Configuration, CreateChatCompletionRequest, CreateChatCompletionResponse, OpenAIApi} from 'openai';
import {AxiosError} from 'axios';
import {randomInt} from '@shared/functions';
import words from '@shared/Words';
import * as process from 'process';

let openai: OpenAIApi | undefined;
let currentApiKey: string | undefined;

const NUM_OF_CHOICES = 1;

const defaultSettings: Partial<CreateChatCompletionRequest> = {
    temperature: 1.5,
    max_tokens: 10,
    n: NUM_OF_CHOICES,
    presence_penalty: 1,
};

function getDefaultSettingsForMultipleWords(count: number): Partial<CreateChatCompletionRequest> {
    return {
        ...defaultSettings,
        max_tokens: 11 * count,
    }
}

const defaultSettingsForGuess: Partial<CreateChatCompletionRequest> = {
    ...defaultSettings,
    temperature: 0.5,
}

function getOpenAiApi(apiKey: string): OpenAIApi {
    if (!openai || currentApiKey !== apiKey) {
        openai = new OpenAIApi(new Configuration({
            apiKey,
        }));
        currentApiKey = apiKey;
    }

    return openai;
}

export function getApiKey(keyOrPassword?: string): string {
    if (keyOrPassword === process?.env?.OPENAI_API_KEY_PASSWORD) {
        return process?.env?.OPENAI_API_KEY ?? '';
    } else {
        return keyOrPassword ?? '';
    }
}

export async function isApiKeyValid(openAiKey: string): Promise<true | string> {
    const request = getCreateChatCompletionRequest('Is this API call valid?', defaultSettings);
    const result = await getFormattedResultFromRequest(openAiKey, request);

    return !result.includes('Error') || result;
}


export async function generateWordsToGuess(openAiKey: string, language: 'en' | 'de', count: number = 1, existingWords: string[] = []): Promise<string[]> {
    const prompt = getPromptForInitialWord(language, count, existingWords);
    const request = getCreateChatCompletionRequest(prompt, getDefaultSettingsForMultipleWords(count));
    const formattedResult = await getFormattedResultFromRequest(openAiKey, request, true);

    return formattedResult.split(';').map((word) => word.trim());
}

export async function generateHintsForWord(openAiKey: string, word: string, count: number, language: 'en' | 'de'): Promise<string[]> {
    const prompt = getPromptForHint(word, count, language);
    const request = getCreateChatCompletionRequest(prompt, getDefaultSettingsForMultipleWords(count));
    const formattedResult = await getFormattedResultFromRequest(openAiKey, request, true);

    return formattedResult.split(';').map((hint) => hint.trim());
}

export async function generateGuessForHints(openAiKey: string, hints: string[], language: 'en' | 'de'): Promise<string> {
    const prompt = getPromptForGuess(hints, language);
    const request = getCreateChatCompletionRequest(prompt, defaultSettingsForGuess);

    return getFormattedResultFromRequest(openAiKey, request);
}

function getCreateChatCompletionRequest(message: string, settings: Partial<CreateChatCompletionRequest>): CreateChatCompletionRequest {
    // tslint:disable-next-line:no-console
    console.log('Prompt to send to OpenAI', message);

    return {
        ...settings,
        model: 'gpt-3.5-turbo',
        messages: [
        {
            role: 'system',
            content: 'Produce one-word answers. When asked for multiple words separate them with semicolons',
        },
        {
            role: 'user',
            content: message,
        }],
    };
}

async function getFormattedResultFromRequest(openAiKey: string, request: CreateChatCompletionRequest, hasAnswerMultipleWords: boolean = false): Promise<string> {
    try {
        const response = await getOpenAiApi(getApiKey(openAiKey)).createChatCompletion(request);

        const data = response.data as CreateChatCompletionResponse;

        const randomAnswer = data.choices[randomInt(NUM_OF_CHOICES - 1)]?.message;
        const answerContent = randomAnswer?.content ?? 'Error';

        // tslint:disable-next-line:no-console
        console.log('answerContent', answerContent);

        return formatAnswer(answerContent, hasAnswerMultipleWords);
    }
    catch (e: unknown) {
        if (isAxiosError(e)) {
            // tslint:disable-next-line:no-console
            console.warn(e.response?.statusText, e.response?.data);

            return `Error: ${e.response?.statusText} - ${e.response?.data?.error.code}`;
        } else {
            // tslint:disable-next-line:no-console
            console.error('unknown error', e);

            return 'Error: unknown error';
        }
    }
}

function formatAnswer(answer: string = '', hasAnswerMultipleWords: boolean = false, shouldBeOnlyOneWord: boolean = false): string {
    const withFormatWithMultipleWords = hasAnswerMultipleWords ? answer.replace(/(\s|,|;)+/g, ';') : answer;
    const onlyLetters = withFormatWithMultipleWords.replace(/[^\p{L} ;]/gu, '');

    return shouldBeOnlyOneWord ? (onlyLetters.split(' ')[0] ?? '') : onlyLetters;
}

function isAxiosError(e: unknown): e is AxiosError {
    return (e as AxiosError).isAxiosError;
}

function getPromptForInitialWord(language: 'en' | 'de', count: number, existingWords: string[]): string {
    const exampleWords = existingWords;
    for (let i = exampleWords.length; i < 3; i++) {
        exampleWords.push(words.getRandom(language));
    }

    if (language === 'de') {
        return `Gib mir genau ${count} Nomen. Beispiele sind: ${exampleWords.join(', ')}`;
    } else {
        return `Give me exactly ${count} nouns. Examples are: ${exampleWords.join(', ')}`;
    }
}

function getPromptForHint(word: string, count: number, language: 'en' | 'de'): string {
    if (language === 'de') {
        return `Gib mir ${count} Ein-Wort-Hinweise für das Wort "${word}"`;
    } else {
        return `Give me ${count} one-word clues for the word "${word}"`;
    }
}

function getPromptForGuess(hints: string[], language: 'en' | 'de'): string {
    if (language === 'de') {
        return `Errate das Wort basierend auf diesen Hinweisen: ${hints.join(', ')}`;
    } else {
        return `Guess the word based on these clues: ${hints.join(', ')}`;
    }
}
