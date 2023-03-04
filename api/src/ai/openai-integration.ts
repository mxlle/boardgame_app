import {Configuration, CreateChatCompletionRequest, CreateChatCompletionResponse, OpenAIApi} from 'openai';
import {AxiosError} from 'axios';
import {randomInt} from '@shared/functions';
import words from '@shared/Words';
import * as process from 'process';

let openai: OpenAIApi | undefined;
let currentApiKey: string | undefined;

const TEMPERATURE = 1.5;
const MAX_TOKENS = 4;
const NUM_OF_CHOICES = 1;
const DEFAULT_LANGUAGE = 'en';

function getOpenAiApi(apiKey: string): OpenAIApi {
    if (!openai || currentApiKey !== apiKey) {
        openai = new OpenAIApi(new Configuration({
            apiKey,
        }));
        currentApiKey = apiKey;
    }

    return openai;
}

function getApiKey(keyOrPassword?: string): string {
    if (keyOrPassword === process?.env?.OPENAI_API_KEY_PASSWORD) {
        return process?.env?.OPENAI_API_KEY ?? '';
    } else {
        return keyOrPassword ?? '';
    }
}


export async function generateWordToGuess(openAiKey: string, language: 'en' | 'de' = DEFAULT_LANGUAGE): Promise<string> {
    const prompt = getPromptForInitialWord(language);
    const request = getCreateChatCompletionRequest(prompt);

    return getFormattedResultFromRequest(openAiKey, request);
}

export async function generateHintForWord(openAiKey: string, word: string, language: 'en' | 'de' = DEFAULT_LANGUAGE): Promise<string> {
    const numOfChoices = 4;
    const prompt = getPromptForHint(word, language);
    const request = getCreateChatCompletionRequest(prompt, numOfChoices);

    return getFormattedResultFromRequest(openAiKey, request, numOfChoices);
}

export async function generateGuessForHints(openAiKey: string, hints: string[], language: 'en' | 'de' = DEFAULT_LANGUAGE): Promise<string> {
    const prompt = getPromptForGuess(hints, language);
    const request = getCreateChatCompletionRequest(prompt);

    return getFormattedResultFromRequest(openAiKey, request);
}

function getCreateChatCompletionRequest(message: string, numOfChoices: number = NUM_OF_CHOICES): CreateChatCompletionRequest {
    return {
        model: 'gpt-3.5-turbo',
        messages: [{
            role: 'system',
            content: message,
        }],
        temperature: TEMPERATURE,
        max_tokens: MAX_TOKENS,
        n: numOfChoices,
    };
}

async function getFormattedResultFromRequest(openAiKey: string, request: CreateChatCompletionRequest, numOfChoices: number = NUM_OF_CHOICES): Promise<string> {
    try {
        const response = await getOpenAiApi(getApiKey(openAiKey)).createChatCompletion(request);

        const data = response.data as CreateChatCompletionResponse;

        const randomAnswer = data.choices[randomInt(numOfChoices - 1)]?.message;
        const answerContent = randomAnswer?.content ?? 'Error';

        return formatAnswer(answerContent);
    }
    catch (e: unknown) {
        if (isAxiosError(e)) {
            // tslint:disable-next-line:no-console
            console.warn(e.response?.statusText, e.response?.data);

            return `Error: ${e.response?.statusText} - ${e.response?.data?.error.code}`;
        } else {
            // tslint:disable-next-line:no-console
            console.error('unknown error', e);

            return 'Unknown error';
        }
    }
}

function formatAnswer(answer: string = '', shouldBeOnlyOneWord: boolean = false): string {
    const onlyLetters = answer.replace(/[^\p{L} ]/gu, '');

    return shouldBeOnlyOneWord ? (onlyLetters.split(' ')[0] ?? '') : onlyLetters;
}

function isAxiosError(e: unknown): e is AxiosError {
    return (e as AxiosError).isAxiosError;
}

function getPromptForInitialWord(language: 'en' | 'de' = DEFAULT_LANGUAGE): string {
    const randomWords = [words.getRandom(language), words.getRandom(language),words.getRandom(language)];

    if (language === 'de') {
        return `Gib mir genau ein Nomen. Beispiele sind: ${randomWords.join(', ')}.`;
    } else {
        return `Give me exactly one noun. Examples are: ${randomWords.join(', ')}.`;
    }
}

function getPromptForHint(word: string, language: 'en' | 'de' = DEFAULT_LANGUAGE): string {
    if (language === 'de') {
        return `Gib mir genau ein Wort, dass helfen kann dieses Wort zu erraten: "${word}".`;
    } else {
        return `Give me exactly one word, that helps to guess this word: "${word}".`;
    }
}

function getPromptForGuess(hints: string[], language: 'en' | 'de' = DEFAULT_LANGUAGE): string {
    if (language === 'de') {
        return `Errate das Wort basierend auf diesen Hinweisen: ${hints.join(', ')}. Antwort in einem Wort.`;
    } else {
        return `Guess the word based on these hints: ${hints.join(', ')}. Answer in one word.`;
    }
}
