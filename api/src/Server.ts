import http from 'http';
import SocketIO from "socket.io";
import GameApi from './routes/Games';
import {GameEvent, IGameApi, ROOM_GAME} from "@gameTypes";


export const httpServer = http.createServer();
const io = SocketIO(httpServer, {
    path: '/api',
    serveClient: false,
});

interface GamesApiCall {
    action: keyof IGameApi,
    auth: string,
    params: any[]
}
type ErrorFirstCallback = (error?: any, data?: any) => void;

io.on('connection', (socket) => {
    // GameController
    socket.on(GameEvent.ApiCall, ({ action, auth, params }: GamesApiCall, ack: ErrorFirstCallback) => {
        const gameApi = new GameApi(io.sockets, auth);

        if (!gameApi[action]) {
            ack('Invalid action');
        }

        (<any>gameApi[action])(...params)
            .then((responseData: any) => ack(null, responseData))
            .catch((error: any) => ack(error));
    });

    socket.on(GameEvent.Subscribe, (room: string, ack: ErrorFirstCallback) => {
        socket.join(room, ack);
    });
    socket.on(GameEvent.Unsubscribe, (room: string, ack: ErrorFirstCallback) => {
        socket.leave(room, ack);
    });
    socket.on(GameEvent.Confetti, (gameId: string, colors: string[]) => {
        socket.in(ROOM_GAME(gameId)).emit(GameEvent.Confetti, colors);
    });
});

export default io;
