import logger from './Logger';
import shortid from 'shortid'; 

export const generateId = () => {
	return shortid();
}

export const pErr = (err: Error) => {
    if (err) {
        logger.error(err);
    }
};
