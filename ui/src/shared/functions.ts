import {OPEN_AI_KEY, SETTING_ID} from './constants';
import {GamePhase, IGame, IUser} from "../types";
import {getPlayerInGame} from "../one-word/gameFunctions";

export function extractGameData(game: IGame) {
	const currentRound = game.rounds[game.round];
	const currentUser = getCurrentUserInGame(game);
	const guesser = getPlayerInGame(game, currentRound.guesserId) || { name: '?', id: '?' };
	const isGuesser = currentUser && currentUser.id === guesser.id;
	const roundHost = getPlayerInGame(game, currentRound.hostId) || { name: '?', id: '?' };
	const isRoundHost = currentUser && currentUser.id === roundHost.id;
	const isGameHost: boolean = !!currentUser?.id && game.hostId === currentUser.id;
	const currentWord = (game.phase === GamePhase.Solution || (!isGuesser && !!currentUser)) ? currentRound.word : '?';
	return { currentRound, currentUser, guesser, isGuesser, roundHost, isRoundHost, isGameHost, currentWord };
}

export function getCurrentUserInGame(game: IGame): IUser | undefined {
	return getPlayerInGame(game, getCurrentUserId());
}

export function getCurrentUserId() {
	let userId = localStorage.getItem(SETTING_ID) ?? '';
	if (!userId) {
		userId = generateId();
		localStorage.setItem(SETTING_ID, userId);
	}
	return userId;
}

export function getOpenAiKey() {
	return localStorage.getItem(OPEN_AI_KEY) ?? '';
}

export function setOpenAiKey(key: string) {
	localStorage.setItem(OPEN_AI_KEY, key);
}

export function generateId() {
	return Math.random().toString(36).replace('0.', '');
}

export function randomInt(max: number) {
	return Math.floor(Math.random()*max);
}

export function sleep(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export function getNameListString(names: string[]) {
	let nameListString = names.join(', ');
	const n = nameListString.lastIndexOf(',');
	if (n >= 0) {
		nameListString = nameListString.substring(0, n) + ' &' + nameListString.substring(n+1, nameListString.length);
	}
	return nameListString;
}

export function getGameDuration(durationInMillis: number) {
	const ONE_SECOND = 1000;
	const ONE_MINUTE = 60 * ONE_SECOND;
	const ONE_HOUR = 60 * ONE_MINUTE;
	const ONE_DAY = 24 * ONE_HOUR;

	let remainingMillis = durationInMillis;
	const days = Math.floor(remainingMillis/ONE_DAY);
	remainingMillis -= days * ONE_DAY;
	const hours = Math.floor(remainingMillis/ONE_HOUR);
	remainingMillis -= hours * ONE_HOUR;
	const minutes = Math.floor(remainingMillis/ONE_MINUTE);
	remainingMillis -= minutes * ONE_MINUTE;
	const seconds = Math.floor(remainingMillis/ONE_SECOND);

	return { days, hours, minutes, seconds };
}

export function easeInQuad(x: number, of: number): number {
	const x1 = x / of;
	const x_quad = x1 * x1;
	return Math.ceil(x_quad * of);
}
