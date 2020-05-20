// custom module declarations

// TODO 
export interface IUser {
    id: string;
    name: string;
    color?: string;
    enteredWords?: string[];
}

export interface IHint {
    hint: string;
    author: string;
    isDuplicate?: boolean
}

export enum GamePhase {
    Init,
    Preparation,
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
    wordsPerPlayer: number;

    round: number;
    phase: GamePhase;
    currentWord?: string;
    currentGuesser?: string;
    currentGuess?: string;
    guessedRight?: boolean;
    roundHost?: string;
    hints: IHint[];
    correctWords: WordResult[];
    wrongWords: WordResult[];
}