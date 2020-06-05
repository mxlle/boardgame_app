import {DEFAULT_NUM_WORDS, SETTING_ID} from './constants';
import { IGame, IUser, WordResult, GamePhase } from '../custom.d';
import shortid from 'shortid';
import i18n from '../i18n'; 

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
	shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZüÜ');
	return shortid();
}

export function emptyGame(): IGame {
    return {"id":"", "name": "", "words":[],"players":[],"host":"","wordsPerPlayer":DEFAULT_NUM_WORDS,"round":0,"phase":0,"hints":[],"correctWords":[],"wrongWords":[]};
}

export function setDocumentTitle(gameName?: string) {
	const appTitleFallback = 'Nur ein Wort!';
    if (gameName) {
        document.title = `${i18n.t('APP_TITLE', appTitleFallback)} - ${gameName}`;
    } else {
        document.title = i18n.t('APP_TITLE', appTitleFallback);
    }
}

export function checkPrevResult(game: IGame, showSnackbar: any, onClose: ()=>void) {
	const wordIndex = GamePhase.End === game.phase ? game.words.length-1 : game.round-1;
    if (wordIndex >= 0) {
        const prevWord = game.words[wordIndex];
        const correctWords = [...game.correctWords].reverse();
        let wrIndex: number = correctWords.findIndex((wr: WordResult) => wr.word === prevWord);
        let wordResult: WordResult, context: string, variant: 'success'|'error';
        if (wrIndex > -1) {
            wordResult = correctWords[wrIndex];
            context = 'CORRECT';
            variant = 'success';
        } else {
            wordResult = game.wrongWords[game.wrongWords.length-1];
            context = 'WRONG';
            variant = 'error';
        }
        if (wordResult.word.trim().toLowerCase() !== wordResult.guess.trim().toLowerCase()) {
            showSnackbar(i18n.t('GAME.MESSAGE.PREV_RESULT', 'Runde abgeschlossen', { context: context, word: wordResult.guess }), {
                variant: variant,
                preventDuplicate: true,
                onClose: onClose
            }); 
        }
    }
}