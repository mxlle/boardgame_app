import {GamePhase, IGame, IUser} from "../custom.d";
import {emptyGame, getCurrentUserId} from "../shared/functions";
import {getRandomColor} from "../common/ColorPicker";
import {WordResult} from "../../../api/src/entities/Game";

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
    game.host = player.id;
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
            if (!word) word = game.currentWord;
            const isCorrect = !!game.currentWord && justOne(word).toLowerCase() === game.currentWord.toLowerCase();
            game.currentGuess = word;
            game.guessedRight = isCorrect;

            game.phase = GamePhase.Solution;
            break;
        case GamePhase.Solution:
            // TODO - copied from BE
            const wordResult: WordResult = {
                word: game.currentWord || '',
                guess: game.currentGuess || ''
            };

            if (game.guessedRight || word) {
                game.correctWords.push(wordResult);
            } else {
                game.wrongWords.push(wordResult);
            }

            if (game.round < game.words.length-1) {
                newRound(game as any);
            } else {
                game.phase = GamePhase.End;
            }
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
            addHint(game as any, TUTORIAL_HINTS[game.round][index], TUTORIAL_PLAYERS[index].id);
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
    game.words = game.words.reverse();
    newRound(game as any, true);
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

export const TUTORIAL_HINTS: string[][] = [
    [
        'Cell',
        'Touchscreen',
        'Apps'
    ], [
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
    ]
].reverse(); // TODO - because words are reversed


// TODO - copied from BE
function newRound(game: IGame, gameStart: boolean = false) {
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

function addHint(game: IGame, hint: string = '', playerId: string = '') {
    let hintObj = game.hints.find(h => h.author === playerId && !h.hint);
    if (!hintObj) hintObj = game.hints.find(h => h.author === playerId);
    if (!hintObj) return;
    hintObj.hint = justOne(hint);

    if (game.hints.every(h => h.hint && h.hint.length > 0)) {
        compareHints(game);
    }
}

function compareHints(game: IGame) {
    const plainHints = game.hints.map(h => h.hint.toLowerCase());
    game.hints.forEach(hint => {
        const value = hint.hint.toLowerCase();
        if (plainHints.indexOf(value) !== plainHints.lastIndexOf(value)) {
            hint.isDuplicate = true;
        }
    });
    game.phase = GamePhase.HintComparing;
}

function justOne(word: string = ''): string {
    return word.split(' ')[0];
}
