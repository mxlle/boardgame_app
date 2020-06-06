import {GamePhase, IGame, IUser} from "../types";
import {getCurrentUserId} from "../shared/functions";
import {addHint, createRounds, emptyGame, guess, newRound, resolveRound} from "./gameFunctions";
import {getRandomColor} from "../common/ColorPicker";

export const TUTORIAL_ID = 'tutorial';
const SETTING_TUTORIAL = 'tutorial.game';

function createTutorial(): IGame {
    let game: IGame = emptyGame();
    game.id = TUTORIAL_ID;
    game.name = 'Tutorial';
    game.$isTutorial = true;
    return game;
}

export function saveTutorial(game: IGame) {
    sessionStorage.setItem(SETTING_TUTORIAL, JSON.stringify(game));
}

export function loadTutorial(): IGame {
    let game: IGame;
    game = JSON.parse(sessionStorage.getItem(SETTING_TUTORIAL) as string);
    if (!game) {
        game = createTutorial();
        saveTutorial(game);
    }
    return game;
}

export function removeTutorial() {
    sessionStorage.removeItem(SETTING_TUTORIAL);
}

export function addPlayerToTutorial(player: IUser) {
    let game = loadTutorial();
    game.players.push(player);
    game.hostId = player.id;
    saveTutorial(game);
    triggerAddingPlayer(game);
}

export function nextTutorialStep(word?: string) {
    let game = loadTutorial();
    switch (game.phase) {
        case GamePhase.Init:
            game.wordsPerPlayer = 1;
            game.phase = GamePhase.Preparation;
            break;
        case GamePhase.Preparation:
            addWordToGame(game, 0);
            triggerAddingWord(game);
            break;
        case GamePhase.HintWriting:
            if (word) addHint(game, word, getCurrentUserId());
            triggerAddingHint(game, 0);
            break;
        case GamePhase.HintComparing:
            game.phase = GamePhase.Guessing;
            break;
        case GamePhase.Guessing:
            if (!word) word = game.rounds[game.round].word;

            guess(game, word);

            game.phase = GamePhase.Solution;
            break;
        case GamePhase.Solution:
            resolveRound(game, !!game.rounds[game.round].correct);
            break;
    }
    saveTutorial(game);
}

function triggerAddingPlayer(game: IGame) {
    setTimeout(() => {
        if (game.players.length <= TUTORIAL_PLAYERS.length) {
            game.players.push(TUTORIAL_PLAYERS[game.players.length-1]);
            saveTutorial(game);
            triggerAddingPlayer(game);
        }
    }, 1000);
}

function triggerAddingWord(game: IGame) {
    setTimeout(() => {
        if (game.words.length < TUTORIAL_WORDS.length) {
            addWordToGame(game, game.words.length)
            saveTutorial(game);
            triggerAddingWord(game);
        } else {
            startGame(game);
        }
    }, 1000);
}

function triggerAddingHint(game: IGame, index: number) {
    setTimeout(() => {
        if (index < TUTORIAL_PLAYERS.length) {
            addHint(game, TUTORIAL_HINTS[game.round][index], TUTORIAL_PLAYERS[index].id);
            saveTutorial(game);
            triggerAddingHint(game, index+1);
        }
    }, 1000);
}

function addWordToGame(game: IGame, index: number) {
    const word: string = TUTORIAL_WORDS[index];
    const player: IUser = game.players[index];
    game.words.push(word);
    if (!player.enteredWords) {
        game.players[index].enteredWords = [word];
    } else {
        player.enteredWords.push(word);
    }
}

function startGame(game: IGame) {
    createRounds(game);
    newRound(game, true);
    saveTutorial(game);
}

export const TUTORIAL_WORDS: string[] = [
    'Smartphone',
    'Flamingo',
    'Titanic',
    'Hogwarts'
];

const TUTORIAL_PLAYERS: IUser[] = [
    {
        name: 'Sarah',
        color: getRandomColor(),
        id: '1'
    },
    {
        name: 'Tom',
        color: getRandomColor(),
        id: '2'
    },
    {
        name: 'Lisa',
        color: getRandomColor(),
        id: '3'
    },
];

// moved by one // TODO
export const TUTORIAL_HINTS: string[][] = [
    [
        'Pink',
        'Bird',
        'Leg'
    ], [
        'Ship',
        '1912',
        'Leonardo'
    ], [
        'Wizards',
        'Harry',
        'School'
    ], [
        'Cell',
        'Touchscreen',
        'Apps'
    ]
];
