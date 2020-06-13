// shared between api and app, needs to be in ui/src because of cra restrictions

import {DEFAULT_NUM_WORDS, GamePhase, IGame, IGameRound, IHint, IUser} from "../types";
import {generateId} from "../shared/functions";

export function addPlayer(game: IGame, player: IUser) {
    if (!game.hostId) game.hostId = player.id; // backup plan
    if (!player.enteredWords) player.enteredWords = [];
    game.players.push(player);
}

export function goToPreparation(game: IGame, wordsPerPlayer: number) {
    if (game.phase !== GamePhase.Init) return;

    game.wordsPerPlayer = wordsPerPlayer || game.wordsPerPlayer || DEFAULT_NUM_WORDS;
    game.phase = GamePhase.Preparation;
}

export function backToLobby(game: IGame) {
    if (game.phase !== GamePhase.Preparation) return;
    game.phase = GamePhase.Init;
}

export function updatePlayer(game: IGame, player: IUser) {
    let currentUser = game.players.find(p => p.id === player.id);
    if (!currentUser) return;
    currentUser.name = player.name;
    currentUser.color = player.color;
    currentUser.enteredWords = player.enteredWords || [];

    // check if ready to start
    const allWordsEntered: boolean = game.players.every(p => p.enteredWords?.length === game.wordsPerPlayer);
    if (allWordsEntered) startGame(game);
}

export function removePlayerFromGame(game: IGame, playerId: string) {
    const index = game.players.findIndex(p => p.id === playerId);
    if (index > -1) {
        game.players.splice(index, 1);
    }
}

export function startGame(game: IGame) {
    createRounds(game);
    newRound(game, true);
}

export function createRounds(game: IGame) {
    const numPlayers = game.players.length;
    const rounds: IGameRound[] = [];
    const words: string[] = game.players.flatMap((p: IUser) => p.enteredWords||[]);
    words.forEach((word: string, i: number) => {
        const guesserIndex = i % game.players.length;
        const guesserId = game.players[guesserIndex].id;

        // calculate word to guess
        const guessTime: number = Math.floor(i/game.players.length);
        const guessFromIndex: number = ((guessTime%2 === 0) ? guesserIndex+1 : guesserIndex-1+numPlayers)%numPlayers;
        const getWordsFrom: IUser = game.players[guessFromIndex];
        const wordToGuess = getWordsFrom.enteredWords ? getWordsFrom.enteredWords[guessTime] : 'Fehler'; // TODO

        let hints: IHint[] = _initHints(game.players, guesserId);
        if (game.players.length < 4) hints = hints.concat(_initHints(game.players, guesserId));
        const gameRound: IGameRound = {
            word: justOne(wordToGuess),
            authorId: getWordsFrom.id,
            guesserId: game.players[guesserIndex].id,
            hostId: game.players[(guesserIndex+1) % game.players.length].id,
            hints: hints,
            guess: '',
            correct: null,
            countAnyway: null
        };
        rounds.push(gameRound);
    });
    game.rounds = rounds;
}

function _initHints(players: IUser[], guesserId: string): IHint[] {
    return players.filter(player => player.id !== guesserId).map(player => {
        return { id: generateId(), hint: '', authorId: player.id }
    });
}

export function newRound(game: IGame, gameStart: boolean = false) {
    if (gameStart) {
        game.round = 0;
    } else {
        game.round++;
    }

    game.phase = GamePhase.HintWriting;
}

export function addHint(game: IGame, hintId: string, hint: string, playerId: string) {
    let hintObj = game.rounds[game.round].hints.find(h => h.id === hintId && h.authorId === playerId);
    if (!hintObj) return;
    hintObj.hint = justOne(hint);

    if (game.rounds[game.round].hints.every(h => h.hint && h.hint.length > 0)) {
        compareHints(game);
    }
}

export function resetHint(game: IGame, hintId: string, playerId: string) {
    let hintObj = game.rounds[game.round].hints.find(h => h.id === hintId && h.authorId === playerId);
    if (!hintObj) return;

    hintObj.hint = '';
}

export function compareHints(game: IGame) {
    const plainHints = game.rounds[game.round].hints.map(h => h.hint.toLowerCase());
    game.rounds[game.round].hints.forEach(hint => {
        const value = hint.hint.toLowerCase();
        if (plainHints.indexOf(value) !== plainHints.lastIndexOf(value)) {
            hint.isDuplicate = true;
        }
    });
    game.phase = GamePhase.HintComparing;
}

export function toggleDuplicateHint(game: IGame, hintId: string) {
    if (game.phase !== GamePhase.HintComparing) return;

    const hintObj = game.rounds[game.round].hints.find(h => h.id === hintId);
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
    const currentRound = game.rounds[game.round];

    currentRound.guess = guess;
    currentRound.correct = isSameWord(currentRound.guess, currentRound.word);
    game.phase = GamePhase.Solution;
}

export function resolveRound(game: IGame, countAsCorrect: boolean) {
    if (game.phase !== GamePhase.Solution) return game;
    const currentRound = game.rounds[game.round];

    currentRound.countAnyway = countAsCorrect;

    if (game.round < game.rounds.length-1) {
        newRound(game);
    } else {
        endOfGame(game);
    }

    return game;
}

export function endOfGame(game: IGame) {
    game.phase = GamePhase.End;
}

function justOne(word: string = ''): string {
    return word.split(' ')[0];
}

function isSameWord(word1: string, word2: string): boolean {
    return justOne(word1).toLowerCase() === justOne(word2).toLowerCase();
}

export function emptyGame(): IGame {
    return {
        "id": "",
        "name": "",
        "players": [],
        "hostId": "",
        "wordsPerPlayer": DEFAULT_NUM_WORDS,
        "round": 0,
        "phase": 0,
        "rounds": []
    };
}

export function getPlayerInGame(game: IGame, userId?: string): IUser | undefined {
    return game.players.find((player: IUser) => player.id === userId);
}

export function getCorrectRounds(game: IGame): IGameRound[] {
    return game.rounds.filter(r => r.correct !== null && (r.correct || r.countAnyway));
}

export function getWrongRounds(game: IGame): IGameRound[] {
    return game.rounds.filter(r => r.correct !== null && !r.correct && !r.countAnyway);
}