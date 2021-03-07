import {SETTING_ID} from './constants';
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

export function easeInQuad(x: number, of: number): number {
	const x1 = x / of;
	const x_quad = x1 * x1;
	return Math.ceil(x_quad * of);
}
