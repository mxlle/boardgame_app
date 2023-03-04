// shared between api and app, needs to be in ui/src because of cra restrictions

export const DEFAULT_NUM_WORDS: number = 2; // Two words per player
export const DELETE_CLEARANCE_TIME: number = 7 * 24 * 60 * 60 * 1000; // 1 week

export interface IGame {
    id: string;
    name: string;
    players: IUser[];
    hostId: string;
    wordsPerPlayer: number;
    language: 'de'|'en';

    round: number;
    phase: GamePhase;

    rounds: IGameRound[];

    joiningRequests: IJoiningRequest[];

    creationTime?: Date;
    startTime?: Date;
    endTime?: Date;

    rematchId?: string;

    isTwoPlayerVariant?: boolean;

    actionRequiredFrom: IUser[]; // calculated virtual property

    $isTutorial?: boolean; // only in FE
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

export interface IJoiningRequest {
    id: string;
    oldPlayerId: string;
    oldPlayerName: string;
    newPlayer: IUser;
    joinAsNewPlayer?: boolean;
    accepted?: boolean;
    denied?: boolean;
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
    addGame: (game: IGame, previousGameId?: string) => Promise<string>;
    startPreparation: (gameId: string, wordsPerPlayer: number, isTwoPlayerVariant?: boolean) => Promise<boolean>;
    backToLobby: (gameId: string) => Promise<boolean>;
    addPlayer: (gameId: string, player: IUser) => Promise<boolean>;
    updatePlayer: (gameId: string, player: IUser) => Promise<boolean>;
    removePlayerFromGame: (gameId: string, playerId: string) => Promise<boolean>;
    requestJoining: (gameId: string, oldPlayerId: string, newPlayer: IUser) => Promise<boolean>;
    handleJoining: (gameId: string, joiningId: string, deny?: boolean) => Promise<boolean>;
    submitHint: (gameId: string, hintId: string, hint: string) => Promise<boolean>;
    resetHint: (gameId: string, hintId: string) => Promise<boolean>;
    endHintPhase: (gameId: string) => Promise<boolean>;
    toggleDuplicateHint: (gameId: string, hintId: string) => Promise<boolean>;
    showHints: (gameId: string) => Promise<boolean>;
    guess: (gameId: string, guess: string) => Promise<boolean>;
    resolveRound: (gameId: string, correct: boolean|undefined) => Promise<boolean>;
    deleteGame: (gameId: string) => Promise<boolean>;

    generateWordToGuess: () => Promise<string>;
    generateHintForWord: (word: string) => Promise<string>;
    generateGuessForHints: (hints: string[]) => Promise<string>;
}

export enum GameEvent {
    Subscribe = 'subscribe',
    Unsubscribe = 'unsubscribe',
    UpdateList = 'updateGameList',
    Update = 'updateGame',
    ApiCall = 'apiCall.games',
    Notification = 'notification',
    Confetti = 'confetti'
}

export enum WordEvent {
    GetRandom = 'getRandomWord'
}

export interface NotificationEventOptions {
    transKey: string;
    audience?: string[];
    tOptions?: any;
    variant?: 'success'|'info'|'warning'|'error';
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
