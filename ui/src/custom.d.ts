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