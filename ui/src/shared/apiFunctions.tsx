import { GAME_URL } from './constants';
import { IGame, IHint, IUser } from '../custom.d';

export async function loadGames(): Promise<IGame[]> {
    return (await _get('all')).games || [];
}

export async function loadGame(id: string): Promise<IGame> {
    return (await _get(id)).game;
}

export async function createGame(game: IGame): Promise<{id:string,playerId:string}> {
    return _post('add', {game});
}

export function deleteGame(id: string) {
    return _delete(`delete/${id}`);
}

export async function addPlayer(id: string, player: IUser): Promise<IUser> {
    return (await _put(`${id}/addPlayer`, {player})).player;
}

export async function updatePlayer(id: string, player: IUser): Promise<IUser> {
    return (await _put(`${id}/updatePlayer`, {player})).player;
}

export function startPreparation(id: string, wordsPerPlayer: number) {
    return _put(`${id}/startPreparation`, {wordsPerPlayer});
}

export function submitHint(id: string, hint: IHint) {
    return _put(`${id}/hint`, {hint});
}

export function toggleDuplicate(id: string, hintIndex: number) {
    return _put(`${id}/toggleDuplicateHint`, {hintIndex});
}

export function showHints(id: string) {
    return _put(`${id}/showHints`);
}

export function guess(id: string, guess: string) {
    return _put(`${id}/guess`, {guess});
}

export function resolveRound(id: string, correct: boolean) {
    return _put(`${id}/resolve`, {correct});
}


function _get(endpoint: string): Promise<any> {
    return new Promise((resolve, reject) => {
        fetch(`${GAME_URL}/${endpoint}`)
            .then(res => res.json())
            .then((data) => {
                resolve(data);
            }, (error) => {
                console.error(error);
                reject(error);
            });
    });
}

function _post(endpoint: string, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
        fetch(`${GAME_URL}/${endpoint}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then((data) => {
                resolve(data);
            }, (error) => {
                console.error(error);
                reject(error);
            })
    });
}

function _put(endpoint: string, data?: any): Promise<any> {
    return new Promise((resolve, reject) => {
        fetch(`${GAME_URL}/${endpoint}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
            .then(res => {
                res.json().then(data => {
                    resolve(data);
                }, error => {
                    resolve();
                });
            }, (error) => {
                console.error(error);
                reject(error);
            })
    });
}

function _delete(endpoint: string) {
    return new Promise((resolve, reject) => {
        fetch(`${GAME_URL}/${endpoint}`, { method: 'DELETE'})
            .then((data) => {
                resolve();
            }, (error) => {
                console.error(error);
                reject(error);
            })
    });   
}