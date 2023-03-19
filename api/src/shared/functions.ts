import logger from './Logger';

export const generateId = () => {
	return Math.random().toString(36).replace('0.', '');
}

export const pErr = (err: Error) => {
    if (err) {
        logger.error(err);
    }
};

export function randomInt(max: number) {
    return Math.floor(Math.random()*max);
}

export function shuffleArray<T>(array: T[]): T[] {
    return array.sort(() => Math.random() - 0.5);
}

export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
