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

export interface IGame {
    id: string;
    words: string[];
    players: IUser[];
    host: string; // hostId
    round: number;
    phase: GamePhase;
    hints: IHint[];
    correctWords: string[];
    wrongWords: string[];
    currentGuesser?: IUser;
}
