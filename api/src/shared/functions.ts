import logger from './Logger';
import shortid from 'shortid'; 

export const generateId = () => {
	shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZüÜ');
	return shortid();
}

export const pErr = (err: Error) => {
    if (err) {
        logger.error(err);
    }
};
