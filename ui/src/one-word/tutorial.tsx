import React from "react";
import {Trans} from "react-i18next";
import {Step} from "react-joyride";
import {GameEvent, GamePhase, IGame, IUser} from "../types";
import {getCurrentUserId} from "../shared/functions";
import {
    addHint,
    emptyGame,
    getPlayersWithRequiredAction,
    guess,
    newRound,
    resolveRound,
    toggleDuplicateHint
} from "./gameFunctions";
import {tutorialEmitter} from "../shared/socket";
import {getRandomColor} from "../shared/color-util";

export const TUTORIAL_ID = 'tutorial';
const SETTING_TUTORIAL = 'tutorial.game';
const MAGIC_TUTORIAL_DELAY = 1000;

function createTutorial(): IGame {
    let game: IGame = emptyGame();
    game.id = TUTORIAL_ID;
    game.name = 'Tutorial';
    game.$isTutorial = true;
    return game;
}

export function saveTutorial(game: IGame) {
    game.actionRequiredFrom = getPlayersWithRequiredAction(game);
    sessionStorage.setItem(SETTING_TUTORIAL, JSON.stringify(game));
    tutorialEmitter.emit(GameEvent.Update, game);
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
            triggerAddingWord(game, 1);
            break;
        case GamePhase.HintWriting:
            let index = 0;
            if (word) {
                addHint(game, getCurrentUserId(), word, getCurrentUserId());
                index++;
            }
            triggerAddingHint(game, index);
            break;
        case GamePhase.HintComparing:
            game.phase = GamePhase.Guessing;
            if (game.rounds[game.round].guesserId.length === 1) {
                setTimeout(() => {
                    tutorialGuess(game);
                    saveTutorial(game);
                }, MAGIC_TUTORIAL_DELAY);
            }
            break;
        case GamePhase.Guessing:
            tutorialGuess(game, word);
            break;
        case GamePhase.Solution:
            if (word && !game.rounds[game.round].correct) tutorialEmitter.emit(GameEvent.Confetti);
            game = resolveRound(game, !!word);
            if (game.phase === GamePhase.HintWriting && game.rounds[game.round].guesserId.length > 1) {
                triggerAddingHint(game, 0);
            }
            break;
    }
    saveTutorial(game);
}

export function toggleDuplicateInTutorial(game: IGame, hintId: string) {
    toggleDuplicateHint(game, hintId);
    saveTutorial(game);
}

function tutorialGuess(game: IGame, word?: string) {
    if (!word) word = TUTORIAL_GUESSES[game.round];

    guess(game, word);

    game.phase = GamePhase.Solution;

    if (game.rounds[game.round].correct) {
        tutorialEmitter.emit(GameEvent.Confetti);
    }
}

function triggerAddingPlayer(game: IGame) {
    setTimeout(() => {
        if (game.players.length <= TUTORIAL_PLAYERS.length) {
            const player = TUTORIAL_PLAYERS[game.players.length-1];
            player.color = getRandomColor(null, game.players.map(p => p.color));
            game.players.push(player);
            saveTutorial(game);
            triggerAddingPlayer(game);
        }
    }, MAGIC_TUTORIAL_DELAY);
}

function triggerAddingWord(game: IGame, index: number) {
    setTimeout(() => {
        if (index < TUTORIAL_WORDS.length) {
            addWordToGame(game, index)
            saveTutorial(game);
            triggerAddingWord(game, index+1);
        } else {
            startGame(game);
        }
    }, MAGIC_TUTORIAL_DELAY);
}

function triggerAddingHint(game: IGame, index: number) {
    setTimeout(() => {
        if (index < TUTORIAL_PLAYERS.length) {
            const currentRound = game.rounds[game.round];
            addHint(game, currentRound.hints[index].id, TUTORIAL_HINTS[currentRound.word][index], currentRound.hints[index].authorId);
            saveTutorial(game);
            triggerAddingHint(game, index+1);
        }
        // check if want to skip phases
        if (game.phase === GamePhase.HintComparing && game.round !== 1 && game.rounds[game.round].hostId.length === 1) { // if not tutorial player is host
            game.phase = GamePhase.Guessing;
            if (game.rounds[game.round].guesserId.length === 1) {
                setTimeout(() => {
                    tutorialGuess(game);
                    saveTutorial(game);
                }, MAGIC_TUTORIAL_DELAY);
            }
            saveTutorial(game);
        }
    }, MAGIC_TUTORIAL_DELAY);
}

function addWordToGame(game: IGame, index: number) {
    const word: string = TUTORIAL_WORDS[index];
    const player: IUser = game.players[index];
    if (!player.enteredWords) {
        game.players[index].enteredWords = [word];
    } else {
        player.enteredWords.push(word);
    }
}

function startGame(game: IGame) {
    createTutorialRounds(game);
    newRound(game, true);
    saveTutorial(game);
}

function createTutorialRounds(game: IGame) {
    game.rounds = [
        {
            word: TUTORIAL_WORDS[0],
            authorId: game.players[0].id,
            guesserId: game.players[1].id,
            hostId: game.players[2].id,
            hints: game.players.filter(p => p.id !== game.players[1].id).map(p => { return { hint: '', authorId: p.id, id: p.id }; }),
            guess: '',
            correct: null,
            countAnyway: null
        },
        {
            word: TUTORIAL_WORDS[1],
            authorId: game.players[1].id,
            guesserId: game.players[2].id,
            hostId: game.players[3].id,
            hints: game.players.filter(p => p.id !== game.players[2].id).map(p => { return { hint: '', authorId: p.id, id: p.id }; }),
            guess: '',
            correct: null,
            countAnyway: null
        },
        {
            word: TUTORIAL_WORDS[2],
            authorId: game.players[2].id,
            guesserId: game.players[3].id,
            hostId: game.players[0].id,
            hints: game.players.filter(p => p.id !== game.players[3].id).map(p => { return { hint: '', authorId: p.id, id: p.id }; }),
            guess: '',
            correct: null,
            countAnyway: null
        },
        {
            word: TUTORIAL_WORDS[3],
            authorId: game.players[3].id,
            guesserId: game.players[0].id,
            hostId: game.players[1].id,
            hints: game.players.filter(p => p.id !== game.players[0].id).map(p => { return { hint: '', authorId: p.id, id: p.id }; }),
            guess: '',
            correct: null,
            countAnyway: null
        }
    ]
}

export const TUTORIAL_WORDS: string[] = [
    'Internet',
    'Astronaut',
    'Titanic',
    'Quidditch'
];

export const TUTORIAL_GUESSES: string[] = [
    'Internet',
    'Apollo',
    'Tiatnic',
    'Quidditch'
];

export const TUTORIAL_HINTS: {[key: string]:  string[]} = {
    'Internet': [
        'online',
        'www',
        'Browser'
    ],
    'Astronaut': [
        'NASA',
        'Armstrong',
        'Armstrong'
    ],
    'Quidditch': [
        'Sport',
        'Potter',
        'Harry'
    ],
    'Titanic': [
        'Iceberg',
        '1912',
        'Leonardo'
    ]
}

const TUTORIAL_PLAYERS: IUser[] = [
    {
        name: 'Sarah',
        id: '1'
    },
    {
        name: 'Tom',
        id: '2'
    },
    {
        name: 'Lisa',
        id: '3'
    },
];

export function getCurrentTutorialSteps(game: IGame): Step[] {
    let steps: Step[];
    switch (game.phase) {
        case GamePhase.Init:
            steps = JOYRIDE_INIT_STEPS[game.players.length ? 1 : 0];
            if (game.players.length > 0) {
                steps[0].title = <Trans i18nKey="TUTORIAL.LOBBY.WELCOME_NAME" tOptions={{name:game.players[0].name}}>Hello friend</Trans>;
            }
            break;
        case GamePhase.Preparation:
            steps = JOYRIDE_PREPARATION_STEPS[0];
            break;
        case GamePhase.HintWriting:
            steps = JOYRIDE_WRITING_STEPS[game.round];
            break;
        case GamePhase.HintComparing:
            steps = JOYRIDE_COMPARING_STEPS[game.round];
            break;
        case GamePhase.Guessing:
            steps = JOYRIDE_GUESSING_STEPS[game.round];
            break;
        case GamePhase.Solution:
            steps = JOYRIDE_SOLUTION_STEPS[game.round];
            break;
        case GamePhase.End:
            steps = JOYRIDE_END_STEPS;
            break;
    }
    return steps;
}

const JOYRIDE_INIT_STEPS: Step[][] = [
    [
        {
            content: <Trans i18nKey="TUTORIAL.LOBBY.NAME">Enter your name</Trans>,
            title: <Trans i18nKey="TUTORIAL.LOBBY.WELCOME">Welcome</Trans>,
            target: '.name-input',
            disableBeacon: true
        },
        {
            content: <Trans i18nKey="TUTORIAL.LOBBY.COLOR">Choose a color</Trans>,
            target: '.name-input + div'
        },
        {
            content: <Trans i18nKey="TUTORIAL.LOBBY.JOIN">Join the game</Trans>,
            target: '.submitBtn'
        }
    ],
    [
        {
            content: <Trans i18nKey="TUTORIAL.LOBBY.TEAMMATES">Here are your teammates</Trans>,
            title: <Trans i18nKey="TUTORIAL.LOBBY.WELCOME_NAME">Hello friend</Trans>,
            target: '.Player-list',
            placement: 'left',
            disableBeacon: true
        },
        {
            content: <Trans i18nKey="TUTORIAL.LOBBY.START">Start the game</Trans>,
            title: <Trans i18nKey="TUTORIAL.LOBBY.START_TITLE">Let's start</Trans>,
            target: '.submitBtn'
        }
    ]
];
const JOYRIDE_PREPARATION_STEPS: Step[][] = [
    [
        {
            content: <Trans i18nKey="TUTORIAL.PREPARATION.EXPLANATION">Enter a word</Trans>,
            title: <Trans i18nKey="TUTORIAL.PREPARATION.WELCOME">Game preparation</Trans>,
            target: '.New-player',
            placement: 'center',
            disableBeacon: true
        },
        {
            content: <Trans i18nKey="TUTORIAL.PREPARATION.WORD" tOptions={{word: TUTORIAL_WORDS[0]}}>Enter word</Trans>,
            target: '.MuiTextField-root'
        },
        {
            content: <Trans i18nKey="TUTORIAL.PREPARATION.SUBMIT">Submit your word</Trans>,
            target: '.submitBtn'
        }
    ]
];
const JOYRIDE_WRITING_STEPS: Step[][] = [
    [
        {
            content: <Trans i18nKey="TUTORIAL.GAME.ENTER_HINT.1" tOptions={{word: TUTORIAL_WORDS[0], player: TUTORIAL_PLAYERS[0].name}}>Enter a hint</Trans>,
            title: <Trans i18nKey="TUTORIAL.GAME.ENTER_HINT.TITLE1">First round</Trans>,
            target: '.WordHint-withInput',
            disableBeacon: true
        }
    ],
    [
        {
            content: <Trans i18nKey="TUTORIAL.GAME.ENTER_HINT.2" tOptions={{word: TUTORIAL_WORDS[1], player: TUTORIAL_PLAYERS[1].name}}>Enter a hint</Trans>,
            title: <Trans i18nKey="TUTORIAL.GAME.ENTER_HINT.TITLE2">Second round</Trans>,
            target: '.WordHint-withInput',
            disableBeacon: true
        }
    ],
    [
        {
            content: <Trans i18nKey="TUTORIAL.GAME.ENTER_HINT.3" tOptions={{word: TUTORIAL_WORDS[2], player: TUTORIAL_PLAYERS[2].name}}>Enter a hint</Trans>,
            title: <Trans i18nKey="TUTORIAL.GAME.ENTER_HINT.TITLE3">Third round</Trans>,
            target: '.WordHint-withInput',
            disableBeacon: true
        }
    ],
    []
];
const JOYRIDE_COMPARING_STEPS: Step[][] = [
    [],
    [
        {
            content: <Trans i18nKey="TUTORIAL.GAME.DUPLICATE_INFO">Notice that duplicate hints will be removed</Trans>,
            title: <Trans i18nKey="TUTORIAL.GAME.DUPLICATE_INFO_TITLE">Oh no!</Trans>,
            target: '.Current-hints',
            placement: 'center',
            disableBeacon: true
        },
        {
            content: <Trans i18nKey="TUTORIAL.GAME.SOLUTION.WRONG_CONTINUE">Press here to continue</Trans>,
            target: '.tutorialBtn'
        },
    ],
    [
        {
            content: <Trans i18nKey="TUTORIAL.GAME.TOGGLE_INFO">Toggle hints</Trans>,
            title: <Trans i18nKey="TUTORIAL.GAME.TOGGLE_INFO_TITLE">Toggle hints</Trans>,
            target: '.Current-hints',
            spotlightClicks: false,
            placement: 'center',
            disableBeacon: true
        },
        {
            content: <Trans i18nKey="TUTORIAL.GAME.TOGGLE_BTN">Use the smiley</Trans>,
            target: '.MuiCheckbox-root'
        },
        {
            content: <Trans i18nKey="TUTORIAL.GAME.START_GUESSING">Continue</Trans>,
            target: '.submitBtn'
        }
    ],
    []
];
const JOYRIDE_GUESSING_STEPS: Step[][] = [
    [],
    [],
    [],
    [
        {
            content: <Trans i18nKey="TUTORIAL.GAME.GUESS">Guess the word</Trans>,
            title: <Trans i18nKey="TUTORIAL.GAME.GUESS_TITLE">Your turn!</Trans>,
            target: '.WordCard-withInput',
            disableBeacon: true
        }
    ]
];
const JOYRIDE_SOLUTION_STEPS: Step[][] = [
    [
        {
            content: <Trans i18nKey="TUTORIAL.GAME.SOLUTION.CONTINUE" tOptions={{player: TUTORIAL_PLAYERS[0].name}}>This was correct. Let's continue</Trans>,
            target: '.Current-word',
            disableBeacon: true
        },
    ],
    [
        {
            content: <Trans i18nKey="TUTORIAL.GAME.SOLUTION.WRONG" tOptions={{player: TUTORIAL_PLAYERS[1].name}}>The answer was wrong</Trans>,
            target: '.Current-word',
            disableBeacon: true
        },
    ],
    [
        {
            content: <Trans i18nKey="TUTORIAL.GAME.SOLUTION.INFO">You can count the result anyway</Trans>,
            target: '.Current-word',
            placement: 'center',
            disableBeacon: true
        },
        {
            content: <Trans i18nKey="TUTORIAL.GAME.SOLUTION.COUNT_WRONG">If wrong</Trans>,
            target: '.submitBtn.wrong'
        },
        {
            content: <Trans i18nKey="TUTORIAL.GAME.SOLUTION.COUNT_CORRECT">If correct</Trans>,
            target: '.submitBtn.correct'
        }
    ],
    []
];
const JOYRIDE_END_STEPS: Step[] = [
    {
        content: <Trans i18nKey="TUTORIAL.GAME.END_INFO">And here are the results for this game</Trans>,
        title: <Trans i18nKey="TUTORIAL.GAME.END_INFO_TITLE">That's it!</Trans>,
        target: '.Game-end-view',
        placement: 'center',
        disableBeacon: true
    }
];
