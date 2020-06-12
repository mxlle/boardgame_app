import { getCurrentUserId } from './functions';
import { IGame, IUser } from '../types';
import socket from './socket';

export async function loadGames(): Promise<IGame[]> {
    return (await _apiCall('allGames')).games || [];
}

export async function loadGame(gameId: string): Promise<IGame> {
    return (await _apiCall('loadGame', {gameId})).game;
}

export async function createGame(game: IGame): Promise<{id:string,playerId:string}> {
    return _apiCall('addGame', {game});
}

export function deleteGame(gameId: string) {
    return _apiCall('delete', {gameId});
}

export async function addPlayer(gameId: string, player: IUser): Promise<IUser> {
    return (await _apiCall('addPlayer', {gameId, player})).player;
}

export async function updatePlayer(gameId: string, player: IUser): Promise<IUser> {
    return (await _apiCall('updatePlayer', {gameId, player})).player;
}

export function startPreparation(gameId: string, wordsPerPlayer: number) {
    return _apiCall('startPreparation', {gameId, wordsPerPlayer});
}

export function submitHint(gameId: string, hint: string) {
    return _apiCall('hint', {gameId, hint});
}

export function toggleDuplicate(gameId: string, hintIndex: number) {
    return _apiCall('toggleDuplicateHint', {gameId, hintIndex});
}

export function showHints(gameId: string) {
    return _apiCall('showHints', {gameId});
}

export function guess(gameId: string, guess: string) {
    return _apiCall('guess', {gameId, guess});
}

export function resolveRound(gameId: string, correct: boolean) {
    return _apiCall('resolveRound', {gameId, correct});
}

function _apiCall(action: string, params?: object): Promise<any> {
    params = params || {};
    return new Promise((resolve, reject) => {
        socket.emit('apiCall.Games', {
            action,
            auth: getCurrentUserId(),
            params
        }, (error: any, data: any) => {
            if (error) {
                reject(error)
            } else {
                resolve(data);
            }
        });
    });
}
