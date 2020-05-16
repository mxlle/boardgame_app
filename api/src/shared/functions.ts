import logger from './Logger';

const ShortUniqueId = require('short-unique-id').default;

export const generateId = () => {
	const generator = new ShortUniqueId({ length: 8 });
	return generator();
}

export const pErr = (err: Error) => {
    if (err) {
        logger.error(err);
    }
};
