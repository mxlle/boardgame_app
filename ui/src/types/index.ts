// shared between api and app, needs to be in ui/src because of cra restrictions

export const DEFAULT_NUM_WORDS: number = 2; // Two words per player

export interface IGame {
    id: string;
    name: string;
    words: string[];
    players: IUser[];
    hostId: string;
    wordsPerPlayer: number;

    round: number;
    phase: GamePhase;

    rounds: IGameRound[];
}

export interface IUser {
    id: string;
    name: string;
    color?: string;
    enteredWords?: string[];
}

export interface IGameRound {
    word: string;
    authorId: string;
    guesserId: string;
    hostId: string;
    hints: IHint[];
    guess: string;
    correct: boolean|null;
    countAnyway: boolean|null;
}

export interface IHint {
    hint: string;
    authorId: string;
    isDuplicate?: boolean;
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
