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

export function addPlayer(game: IGame, player: IUser) {
    if (game.players.length === 0 || !game.host) game.host = player.id;
    if (!player.enteredWords) player.enteredWords = [];
    game.players.push(player);

    game.words.push(...player.enteredWords);
}

export function startGame(game: IGame) {
    createWordOrder(game);
    newRound(game, true);
}

export function createWordOrder(game: IGame) {
    const newWordOrder: string[] = [];
    const numPlayers = game.players.length;
    game.words.forEach((word: string, i: number) => {
        const guesserIndex = i % game.players.length;
        const guesser: IUser = game.players[guesserIndex];
        const guessTime: number = Math.floor(i/game.players.length);
        const guessFromIndex: number = ((guessTime%2 === 0) ? guesserIndex+1 : guesserIndex-1+numPlayers)%numPlayers;
        const getWordsFrom: IUser = game.players[guessFromIndex];
        const wordToGuess = getWordsFrom.enteredWords ? getWordsFrom.enteredWords[guessTime] : 'Fehler'; // TODO
        newWordOrder.push(wordToGuess.trim());
    });
    game.words = newWordOrder;
    game.words = game.words.filter(word => word && word.length > 0);
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
    if (game.players.length < 4) game.hints = game.hints.concat(game.hints);
}

export function addHint(game: IGame, hint: string = '', playerId: string = '') {
    let hintObj = game.hints.find(h => h.author.id === playerId && !h.hint);
    if (!hintObj) hintObj = game.hints.find(h => h.author.id === playerId);
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

export function toggleDuplicateHint(game: IGame, hintIndex: number) {
    if (game.phase !== GamePhase.HintComparing) return;
    
    const hintObj = game.hints[hintIndex];
    if (hintObj) {
        hintObj.isDuplicate = !hintObj.isDuplicate;
    }
}

export function showHints(game: IGame) {
    if (game.phase !== GamePhase.HintComparing) return;

    game.phase = GamePhase.Guessing;
}

export function guess(game: IGame, guess: string) {
    if (game.phase !== GamePhase.Guessing) return;

    if (!game.currentWord || !guess) return;
    const isCorrect = guess.trim().toLowerCase() === game.currentWord.toLowerCase();

    game.currentGuess = guess;
    game.guessedRight = isCorrect;
    game.phase = GamePhase.Solution;
}

export function resolveRound(game: IGame, countAsCorrect: boolean) {
    if (game.phase !== GamePhase.Solution) return;

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