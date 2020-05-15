// custom module declarations

// TODO 
export interface IUser {
    id: string;
    name: string;
    color?: string;
}

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