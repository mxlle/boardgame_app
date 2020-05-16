import { IUser } from './User';
export { IUser }; // reexport

export interface IHint {
    hint: string;
    author: IUser;
    isDuplicate?: boolean
}

export enum GamePhase {
    Init,
    HintWriting,
    HintComparing,
    Guessing,
    Solution,
    End
}

export interface WordResult {
    word: string;
    guess: string;
}

export interface IGame {
    id: string;
    name: string;
    words: string[];
    players: IUser[];
    host: string; // hostId

    round: number;
    phase: GamePhase;
    currentWord?: string;
    currentGuesser?: IUser;
    currentGuess?: string;
    guessedRight?: boolean;
    hints: IHint[];
    correctWords: WordResult[];
    wrongWords: WordResult[];
}

export function startGame(game: IGame) {
    newRound(game, true);
}

export function newRound(game: IGame, gameStart: boolean = false) {
    if (gameStart) {
        game.round = 0;
    } else {
        game.round++;
    }

    game.phase = GamePhase.HintWriting;
    game.currentWord = game.words[game.round];
    game.currentGuesser = game.players[game.round % game.players.length];
    game.currentGuess = '';
    game.guessedRight = false;
    game.hints = game.players.filter(player => !game.currentGuesser || player.id !== game.currentGuesser.id).map(player => { return { hint: '', author: player } });
}

export function addHint(game: IGame, hint: string = '', playerId: string = '') {
    const hintObj = game.hints.find(h => h.author.id === playerId);
    if (!hintObj) return; // TODO
    hintObj.hint = hint.split(' ')[0]; // just one word

    if (game.hints.every(h => h.hint && h.hint.length > 0)) {
        compareHints(game);
    }
}

export function compareHints(game: IGame) {
    const plainHints = game.hints.map(h => h.hint.toLowerCase());
    game.hints.forEach(hint => {
        const value = hint.hint.toLowerCase();
        if (plainHints.indexOf(value) !== plainHints.lastIndexOf(value)) {
            hint.isDuplicate = true;
        }
    });
    game.phase = GamePhase.HintComparing;
}

export function showHints(game: IGame) {
    game.phase = GamePhase.Guessing;
}

export function guess(game: IGame, guess: string) {
    if (!game.currentWord || !guess) return;
    const isCorrect = guess.toLowerCase() === game.currentWord.toLowerCase();

    game.currentGuess = guess;
    game.guessedRight = isCorrect;
    game.phase = GamePhase.Solution;
}

export function resolveRound(game: IGame, countAsCorrect: boolean) {
    const wordResult: WordResult = {
        word: game.currentWord || '',
        guess: game.currentGuess || ''
    };

    if (game.guessedRight || countAsCorrect) {
        game.correctWords.push(wordResult);
    } else {
        game.wrongWords.push(wordResult);
    }

    if (game.round < game.words.length-1) {
        newRound(game);
    } else {
        endOfGame(game);
    }
}

export function endOfGame(game: IGame) {
    game.phase = GamePhase.End;
}