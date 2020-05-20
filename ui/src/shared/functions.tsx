import { APP_TITLE, SETTING_ID } from './constants';
import { IGame, IUser } from '../custom.d';
import shortid from 'shortid'; 

export function getCurrentUserId() {
	let userId = localStorage.getItem(SETTING_ID) || '';
	if (!userId) {
		userId = generateId();
		localStorage.setItem(SETTING_ID, userId);
	}
	return userId;
}

export function getCurrentUserInGame(game: IGame): IUser|undefined {
    return getUserInGame(game, getCurrentUserId());
}

export function getUserInGame(game: IGame, userId?: string): IUser|undefined {
    return game.players.find((player: IUser) => player.id === userId);
}

export function generateId() {
	return shortid();
}

export function setDocumentTitle(gameName?: string) {
    if (gameName) {
        document.title = `${APP_TITLE} - ${gameName}`;
    } else {
        document.title = APP_TITLE;
    }
}