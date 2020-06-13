// shared between api and app, needs to be in ui/src because of cra restrictions

export const DEFAULT_NUM_WORDS: number = 2; // Two words per player

export interface IGame {
    id: string;
    name: string;
    players: IUser[];
    hostId: string;
    wordsPerPlayer: number;

    round: number;
    phase: GamePhase;

    rounds: IGameRound[];

    $isTutorial?: boolean;
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
    id: string;
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

export interface IGameApi {
    loadGames: () => Promise<IGame[]>;
    loadGame: (gameId: string) => Promise<IGame|null>;
    addGame: (game: IGame) => Promise<string>;
    startPreparation: (gameId: string, wordsPerPlayer: number) => Promise<boolean>;
    backToLobby: (gameId: string) => Promise<boolean>;
    addPlayer: (gameId: string, player: IUser) => Promise<boolean>;
    updatePlayer: (gameId: string, player: IUser) => Promise<boolean>;
    removePlayerFromGame: (gameId: string, playerId: string) => Promise<boolean>;
    submitHint: (gameId: string, hintId: string, hint: string) => Promise<boolean>;
    resetHint: (gameId: string, hintId: string) => Promise<boolean>;
    toggleDuplicateHint: (gameId: string, hintId: string) => Promise<boolean>;
    showHints: (gameId: string) => Promise<boolean>;
    guess: (gameId: string, guess: string) => Promise<boolean>;
    resolveRound: (gameId: string, correct: boolean|undefined) => Promise<boolean>;
    deleteGame: (gameId: string) => Promise<boolean>;
}

export enum GameEvent {
    Subscribe = 'subscribe',
    Unsubscribe = 'unsubscribe',
    UpdateList = 'updateGameList',
    Update = 'updateGame',
    ApiCall = 'apiCall.Games',
    Confetti = 'confetti'
}

// Event values from socket-io
export enum SocketEvent {
    Connect = 'connect',
    ConnectError = 'connect_error',
    ConnectTimeout = 'connect_timeout',
    Connecting = 'connecting',
    Disconnect = 'disconnect',
    Error = 'error',
    Reconnect = 'reconnect',
    ReconnectAttempt = 'reconnect_attempt',
    ReconnectFailed = 'reconnect_failed',
    ReconnectError = 'reconnect_error',
    Reconnecting = 'reconnecting',
    Ping = 'ping',
    Pong = 'pong',
}

export const ROOM_GAME_LIST = 'gameList';
export const ROOM_GAME = (id: string) => `game.${id}`;
