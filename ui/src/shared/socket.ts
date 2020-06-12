import io from 'socket.io-client';
import EventEmitter from 'events';

const socket = io({
    path: '/api',
    transports: ['websocket']
});

socket.on('connect', () => {
    console.debug('Socket.io connected:  ' + socket.id);
});
socket.on('connect_error', (e: object) => console.error('connect_error', e));
socket.on('error', (e: object) => console.error('error', e));
socket.on('connect_timeout', (timeout: any) => console.error('connect_timeout', timeout));
socket.on('disconnect', (timeout: any) => console.error('disconnect', timeout));

export default socket;

export const tutorialEmitter = new EventEmitter();

