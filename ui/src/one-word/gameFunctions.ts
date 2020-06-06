import {DEFAULT_NUM_WORDS, IGame, GamePhase, IUser, WordResult} from "../types";

export function addPlayer(game: IGame, player: IUser) {
    if (!game.host) game.host = player.id; // TODO still needed?
    if (!player.enteredWords) player.enteredWords = [];
    game.players.push(player);

    game.words.push(...player.enteredWords);
}

export function goToPreparation(game: IGame, wordsPerPlayer: number) {
    if (game.phase !== GamePhase.Init) return;

    game.wordsPerPlayer = wordsPerPlayer || game.wordsPerPlayer || DEFAULT_NUM_WORDS;
    game.phase = GamePhase.Preparation;
}

export function updatePlayer(game: IGame, player: IUser) {
    let currentUser = game.players.find(p => p.id === player.id);
    if (!currentUser) return;
    currentUser.name = player.name;
    currentUser.color = player.color;
    currentUser.enteredWords = player.enteredWords || [];

    game.words.push(...currentUser.enteredWords);

    // check if ready to start
    const allWordsEntered: boolean = game.words.length >= game.wordsPerPlayer*game.players.length;
    if (allWordsEntered) startGame(game);
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
        const guessTime: number = Math.floor(i/game.players.length);
        const guessFromIndex: number = ((guessTime%2 === 0) ? guesserIndex+1 : guesserIndex-1+numPlayers)%numPlayers;
        const getWordsFrom: IUser = game.players[guessFromIndex];
        const wordToGuess = getWordsFrom.enteredWords ? getWordsFrom.enteredWords[guessTime] : 'Fehler'; // TODO
        newWordOrder.push(justOne(wordToGuess));
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
    game.currentGuesser = game.players[game.round % game.players.length].id;
    game.roundHost = game.players[(game.round+1) % game.players.length].id;
    game.currentGuess = '';
    game.guessedRight = false;
    game.hints = game.players.filter(player => player.id !== game.currentGuesser).map(player => { return { hint: '', author: player.id } });
    if (game.players.length < 4) game.hints = game.hints.concat(game.hints);
}

export function addHint(game: IGame, hint: string = '', playerId: string = '') {
    let hintObj = game.hints.find(h => h.author === playerId && !h.hint);
    if (!hintObj) hintObj = game.hints.find(h => h.author === playerId);
    if (!hintObj) return; // TODO
    hintObj.hint = justOne(hint);

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
    const isCorrect = justOne(guess).toLowerCase() === game.currentWord.toLowerCase();

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

function justOne(word: string = ''): string {
    return word.split(' ')[0];
}