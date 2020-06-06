import {SETTING_ID} from './constants';
import shortid from 'shortid';
import i18n from '../i18n';
import {IGame, IUser} from "../types";
import {getUserInGame} from "../one-word/gameFunctions";

export function getCurrentUserInGame(game: IGame): IUser | undefined {
	return getUserInGame(game, getCurrentUserId());
}

export function getCurrentUserId() {
	let userId = localStorage.getItem(SETTING_ID) || '';
	if (!userId) {
		userId = generateId();
		localStorage.setItem(SETTING_ID, userId);
	}
	return userId;
}

export function generateId() {
	shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZüÜ');
	return shortid();
}

export function setDocumentTitle(gameName?: string) {
	const appTitleFallback = 'Nur ein Wort!';
    if (gameName) {
        document.title = `${i18n.t('APP_TITLE', appTitleFallback)} - ${gameName}`;
    } else {
        document.title = i18n.t('APP_TITLE', appTitleFallback);
    }
}