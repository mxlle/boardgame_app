const uuid4 = require('uuid4');

import { IUser } from './User';

interface IHint {
    hint: string;
    author: IUser;
}

export enum GamePhase {
    Init,
    HintWriting,
    HintComparing,
    Guessing,
    End
}

interface IGameProps {
    words: string[];
    players: IUser[];
}

interface IGameState {
    round: number;
    phase: GamePhase;
    hints: IHint[];
    correctWords: string[];
    wrongWords: string[];
    currentGuesser?: IUser;
}

export interface IGame {
    id: string;
    props: IGameProps;
    state: IGameState;
}

class Game implements IGame {

    public id: string;
    public props: IGameProps;
    public state: IGameState;

    constructor(words: string[] = [], players: IUser[] = []) {
        this.id = uuid4();
        this.props = {
            words: words,
            players: players
        };
        this.state = {
            round: 0,
            phase: GamePhase.Init,
            hints: [],
            correctWords: [],
            wrongWords: []
        }
    }
}

export default Game;
