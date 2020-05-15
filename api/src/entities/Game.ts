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
    End
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
    hints: IHint[];
    correctWords: string[];
    wrongWords: string[];
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
    game.hints = game.players.filter(player => !game.currentGuesser || player.id !== game.currentGuesser.id).map(player => { return { hint: '', author: player } });
}

export function addHint(game: IGame, hint: string, playerId: string) {
    const hintObj = game.hints.find(h => h.author.id === playerId);
    if (!hintObj) return; // TODO
    hintObj.hint = hint;

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
    if (isCorrect) {
        game.correctWords.push(game.currentWord);
    } else {
        game.wrongWords.push(game.currentWord);
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