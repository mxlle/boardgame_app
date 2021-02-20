// shared between api and app, needs to be in ui/src because of cra restrictions

import {
    DEFAULT_NUM_WORDS,
    DELETE_CLEARANCE_TIME,
    GamePhase,
    IGame,
    IGameRound,
    IHint,
    IJoiningRequest,
    IUser
} from "../types";
import {generateId, randomInt} from "../shared/functions";
import levenshtein from "fast-levenshtein";

export function addPlayer(game: IGame, player: IUser) {
    if (!game.hostId) game.hostId = player.id; // backup plan
    if (!player.enteredWords) player.enteredWords = [];
    game.players.push(player);
}

export function goToPreparation(game: IGame, wordsPerPlayer: number, isTwoPlayerVariant: boolean = false) {
    if (game.phase !== GamePhase.Init) return;

    game.wordsPerPlayer = wordsPerPlayer || game.wordsPerPlayer || DEFAULT_NUM_WORDS;
    game.isTwoPlayerVariant = isTwoPlayerVariant;
    game.startTime = new Date();
    if (game.isTwoPlayerVariant) {
        startGame(game);
    } else {
        game.phase = GamePhase.Preparation;
    }
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

export function joinDuringGame(game: IGame, joiningRequest: IJoiningRequest, addNewRounds: boolean = false) {
    const player = joiningRequest.newPlayer;
    const previousPlayerCount = game.players.length;
    const newRounds: {index: number, round: IGameRound}[] = [];
    game.players.push(player);
    for (let i = game.round; i < game.rounds.length; i++) {
        const round = game.rounds[i];
        if (addNewRounds && i !== 0 && i % (previousPlayerCount - 1) === 0) { // replace guesser with new one
            // new round
            const word = player.enteredWords ? player.enteredWords[i/(previousPlayerCount - 1) - 1] : '';
            const newRoundGuesserId = round.guesserId;
            const newRoundHints = _initHints(game.players, newRoundGuesserId);
            newRounds.push({
                index: i,
                round: {
                    word,
                    authorId: player.id,
                    guesserId: newRoundGuesserId,
                    hostId: player.id,
                    hints: newRoundHints,
                    guess: '',
                    correct: null,
                    countAnyway: null
                }
            });
            // current round
            round.hints = _initHints(game.players, player.id);
            round.guesserId = player.id;
        } else {
            round.hints.push({ authorId: player.id, hint: '', id: generateId() });
        }
    }
    if (addNewRounds) {
        for (let j = newRounds.length - 1; j >= 0; j--) {
            game.rounds.splice(newRounds[j].index + 1, 0, newRounds[j].round);
        }
    }
}

export function takeOverPlayer(game: IGame, joiningRequest: IJoiningRequest) {
    const { oldPlayerId, newPlayer } = joiningRequest;
    const oldPlayer = game.players.find(p => p.id === oldPlayerId);
    if (!oldPlayer) return;
    oldPlayer.id = newPlayer.id;
    oldPlayer.name = newPlayer.name;
    oldPlayer.color = newPlayer.color || oldPlayer.color;
    if (game.hostId === oldPlayerId) game.hostId = newPlayer.id;
    game.rounds.forEach((round) => {
        if (round.hostId === oldPlayerId) round.hostId = newPlayer.id;
        if (round.guesserId === oldPlayerId) round.guesserId = newPlayer.id;
        if (round.authorId === oldPlayerId) round.authorId = newPlayer.id;
        round.hints.forEach((hint) => {
           if (hint.authorId === oldPlayerId) hint.authorId = newPlayer.id;
        });
    });
}

export function startGame(game: IGame) {
    createRounds(game);
    newRound(game, true);
}

export function createRounds(game: IGame) {
    const numPlayers = game.players.length;
    const roundCount = numPlayers*game.wordsPerPlayer;

    for (let i = 0; i < roundCount; i++) {
        const guesserIndex = i % game.players.length;
        const hostIndex = (i+1) % game.players.length;
        const guesserId = game.players[guesserIndex].id;
        const hostId = game.players[hostIndex].id;

        let hints: IHint[] = _initHints(game.players, guesserId);
        if (game.players.length < 4) hints = hints.concat(_initHints(game.players, guesserId));
        if (game.isTwoPlayerVariant) hints = hints.concat(_initHints(game.players, guesserId));

        const gameRound: IGameRound = {
            word: '',
            authorId: '',
            guesserId,
            hostId,
            hints: hints,
            guess: '',
            correct: null,
            countAnyway: null
        };
        game.rounds.push(gameRound);
    }

    assignWordsToRounds(game);
}

function _initHints(players: IUser[], guesserId: string): IHint[] {
    return players.filter(player => player.id !== guesserId).map(player => {
        return { id: generateId(), hint: '', authorId: player.id }
    });
}

function assignWordsToRounds(game: IGame) {
    let words: {word: string, authorId: string}[] = game.players.flatMap((p: IUser) => (p.enteredWords||[]).map(w => ({word: w, authorId: p.id})));
    const findRound = (r: IGameRound, round: IGameRound) => r.authorId !== round.guesserId && words.some(wo => wo.authorId !== r.guesserId);

    for (let i = 0; i < game.rounds.length; i++) {
        const round = game.rounds[i];
        let wordOptions = words.filter(wo => wo.authorId !== round.guesserId);
        let wordToGuess: {word: string, authorId: string};

        if (wordOptions.length) {
            wordToGuess = wordOptions[randomInt(wordOptions.length)];
            words = words.filter(wo => wo !== wordToGuess);
        } else {
            const swapRound = game.rounds.find(r => findRound(r, round));
            if (!swapRound) throw new Error('assignWordsToRounds: no solution found');

            const swapWord = { word: swapRound.word, authorId: swapRound.authorId};

            wordOptions = words.filter(wo => wo.authorId !== swapRound.guesserId);
            wordToGuess = wordOptions[randomInt(wordOptions.length)];
            words = words.filter(wo => wo !== wordToGuess);
            swapRound.word = wordToGuess.word;
            swapRound.authorId = wordToGuess.authorId;

            wordToGuess = swapWord;
        }

        round.word = wordToGuess.word;
        round.authorId = wordToGuess.authorId;
    }
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
    hintObj.hint = hint.trim();

    if (game.rounds[game.round].hints.every(h => h.hint && h.hint.length > 0)) {
        if (game.isTwoPlayerVariant) {
            removeTwoPlayerHint(game);
        } else {
            compareHints(game);
        }
    }
}

export function resetHint(game: IGame, hintId: string, playerId: string) {
    let hintObj = game.rounds[game.round].hints.find(h => h.id === hintId && h.authorId === playerId);
    if (!hintObj) return;

    hintObj.hint = '';
}

export function compareHints(game: IGame) {
    const currentRound = game.rounds[game.round];
    const currentRoundHints = currentRound.hints;
    for (let i = 0; i < currentRoundHints.length; i++) {
        const hint1 = currentRoundHints[i];
        for (let j = i+1; j < currentRoundHints.length; j++) {
            const hint2 = currentRoundHints[j];
            if (areDuplicates(hint1.hint, hint2.hint)) {
                hint1.isDuplicate = true;
                hint2.isDuplicate = true;
            }
        }
        if (!hint1.isDuplicate && areDuplicates(hint1.hint, currentRound.word)) {
            hint1.isDuplicate = true;
        }
        if (!hint1.isDuplicate && hint1.hint?.includes(' ')) {
            hint1.isDuplicate = true;
        }
    }
    game.phase = GamePhase.HintComparing;
}

export function removeTwoPlayerHint(game: IGame) {
    const currentRoundHints = game.rounds[game.round].hints;
    const randomIndex = randomInt(currentRoundHints.length);
    currentRoundHints[randomIndex].isDuplicate = true;

    game.phase = GamePhase.Guessing;
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
    game.endTime = new Date();
}

function justOne(word: string = ''): string {
    return word.split(' ')[0];
}

function isSameWord(word1: string = '', word2: string = ''): boolean {
    return justOne(word1).toLowerCase() === justOne(word2).toLowerCase();
}

function getSimilarity(word1: string = '', word2: string = '') {
    const levDistance = levenshtein.get(word1, word2);
    const combinedLength = word1.length + word2.length;
    return (combinedLength-levDistance)/combinedLength;
}

function getBiggestSubstring(word1: string = '', word2: string = '') {
    for (let substrLength = Math.min(word1.length, word2.length); substrLength > 0; substrLength--) {
        for (let i = 0; i <= word1.length-substrLength; i++) {
            const wordPart = word1.substr(i, substrLength);
            if (word2.includes(wordPart)) return wordPart;
        }
    }
    return '';
}

function areDuplicates(word1: string = '', word2: string = ''): boolean {
    let result = false;
    word1 = word1.toLowerCase();
    word2 = word2.toLowerCase();
    // let the magic begin
    const similarity = getSimilarity(word1, word2);
    if (similarity >= 0.8) {
        result = true;
    } else {
        const biggestSubstring = getBiggestSubstring(word1, word2);
        let score = biggestSubstring.length;
        if (word1.startsWith(biggestSubstring)) score++;
        if (word2.startsWith(biggestSubstring)) score++;
        const relativeScore = score / Math.min(word1.length, word2.length);
        if (score >= 5 && relativeScore > 0.5) result = true;
    }
    return result;
}

export function emptyGame(): IGame {
    return {
        "id": "",
        "name": "",
        "players": [],
        "hostId": "",
        "wordsPerPlayer": DEFAULT_NUM_WORDS,
        "language": "en",
        "joiningRequests": [],
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

export function getClearedForDeletion(game: IGame, nowTime: number = (new Date()).getTime()): boolean {
    if (game?.creationTime) {
        const diff = nowTime - (new Date(game.creationTime).getTime());
        return diff > DELETE_CLEARANCE_TIME;
    } else {
        return [GamePhase.Init, GamePhase.End].includes(game.phase);
    }
}
