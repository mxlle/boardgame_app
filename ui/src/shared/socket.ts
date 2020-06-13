import io from 'socket.io-client';
import EventEmitter from 'events';
import {SocketEvent} from "../types";

const socket = io({
    path: '/api'
});

socket.on(SocketEvent.Connect, () => {
    console.debug('Socket.io connected:  ' + socket.id);
});
socket.on(SocketEvent.ConnectError, (e: object) => console.error('connect_error', e));
socket.on(SocketEvent.Error, (e: object) => console.error('error', e));
socket.on(SocketEvent.ConnectTimeout, (timeout: any) => console.error('connect_timeout', timeout));
socket.on(SocketEvent.Disconnect, (timeout: any) => console.error('disconnect', timeout));

export default socket;

export const tutorialEmitter = new EventEmitter();

