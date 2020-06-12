import http from 'http';
import SocketIO from "socket.io";
import GameApi from './routes/Games';


export const httpServer = http.createServer();
const io = SocketIO(httpServer, {
    path: '/api',
    serveClient: false,
});

interface GamesApiCall {
    action: keyof typeof GameApi,
    auth: string,
    params?: any
}
type ErrorFirstCallback = (error?: any, data?: any) => void;

io.on('connection', (socket) => {
    // GameController
    socket.on('apiCall.Games', ({ action, auth, params }: GamesApiCall, ack: ErrorFirstCallback) => {
        if (!GameApi.hasOwnProperty(action)) {
            ack('Invalid action');
        }

        let handler = GameApi[action];

        handler(io.sockets, auth, params||{})
            .then((responseData: any) => ack(null, responseData))
            .catch((error: any) => ack(error));
    });

    socket.on('subscribe', (room: string, ack: ErrorFirstCallback) => {
        // TODO authentication
        socket.join(room, ack);
        console.log('joined room ', room);
    });
    socket.on('unsubscribe', (room: string, ack: ErrorFirstCallback) => {
        socket.leave(room, ack);
        console.log('left room ', room);
    });
});

export default io;
