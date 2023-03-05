import {getCurrentUserId} from './functions';
import {GameEvent, IGameApi} from '../types';
import socket from './socket';

const GameApi: IGameApi = new Proxy({} as IGameApi, {
    get: (that, action) => function (...params: any[]) {
        return new Promise((resolve, reject) => {
            socket.emit(GameEvent.ApiCall, {
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
})

export default GameApi;

