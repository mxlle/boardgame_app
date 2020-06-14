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
