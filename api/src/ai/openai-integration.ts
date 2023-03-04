import {Configuration, CreateChatCompletionRequest, CreateChatCompletionResponse, OpenAIApi} from 'openai';
import {AxiosError} from 'axios';
import {randomInt} from '@shared/functions';
import words from '@shared/Words';

const openai = new OpenAIApi(new Configuration({
    apiKey: process?.env?.OPENAI_API_KEY,
}));

const TEMPERATURE = 1;
const MAX_TOKENS = 4;
const NUM_OF_CHOICES = 1;
const DEFAULT_LANGUAGE = 'de';


export async function generateWordToGuess(language: 'en' | 'de' = DEFAULT_LANGUAGE): Promise<string> {
    const prompt = getPromptForInitialWord(language);
    const request = getCreateChatCompletionRequest(prompt);

    return getFormattedResultFromRequest(request);
}

export async function generateHintForWord(word: string, language: 'en' | 'de' = DEFAULT_LANGUAGE): Promise<string> {
    const numOfChoices = 3;
    const prompt = getPromptForHint(word, language);
    const request = getCreateChatCompletionRequest(prompt, numOfChoices);

    return getFormattedResultFromRequest(request, numOfChoices);
}

export async function generateGuessForHints(hints: string[], language: 'en' | 'de' = DEFAULT_LANGUAGE): Promise<string> {
    const prompt = getPromptForGuess(hints, language);
    const request = getCreateChatCompletionRequest(prompt);

    return getFormattedResultFromRequest(request);
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

async function getFormattedResultFromRequest(request: CreateChatCompletionRequest, numOfChoices: number = NUM_OF_CHOICES): Promise<string> {
    try {
        const response = await openai.createChatCompletion(request);

        const data = response.data as CreateChatCompletionResponse;

        const randomAnswer = data.choices[randomInt(numOfChoices - 1)]?.message;
        const answerContent = randomAnswer?.content ?? 'Error';

        return formatAnswer(answerContent);
    }
    catch (e: unknown) {
        if (isAxiosError(e)) {
            // tslint:disable-next-line:no-console
            console.warn(e.response?.statusText, e.response?.data);
        } else {
            // tslint:disable-next-line:no-console
            console.error('unknown error', e);
        }

        return 'Error';
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
