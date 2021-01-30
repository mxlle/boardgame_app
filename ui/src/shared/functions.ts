import {SETTING_ID} from './constants';
import {IGame, IUser} from "../types";
import {getPlayerInGame} from "../one-word/gameFunctions";

export function getCurrentUserInGame(game: IGame): IUser | undefined {
	return getPlayerInGame(game, getCurrentUserId());
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
	return Math.random().toString(36).replace('0.', '');
}

export function randomInt(max: number) {
	return Math.floor(Math.random()*max);
}

export function getNameListString(names: string[]) {
	let nameListString = names.join(', ');
	const n = nameListString.lastIndexOf(',');
	if (n >= 0) {
		nameListString = nameListString.substring(0, n) + ' &' + nameListString.substring(n+1, nameListString.length);
	}
	return nameListString;
}

export function setDocumentTitle(i18n: any, gameName?: string) {
	const appTitleFallback = 'Nur ein Wort!';
    if (gameName) {
        document.title = `${i18n.t('APP_TITLE', appTitleFallback)} - ${gameName}`;
    } else {
        document.title = i18n.t('APP_TITLE', appTitleFallback);
    }
}
