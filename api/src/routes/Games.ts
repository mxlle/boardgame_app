import { generateId } from '@shared/functions';

import GameDao from '@daos/Game';
import { GameController, IUser, GamePhase } from "@entities/Game";
import { paramMissingError, gameNotFoundError, forbiddenError } from '@shared/constants';
import {Namespace} from "socket.io";
import {IGame, GameEvent, IGameApi, ROOM_GAME, ROOM_GAME_LIST} from "@gameTypes";

// Init shared
const gameDao = new GameDao();

class GameApi implements IGameApi {
    private socket: Namespace;
    private readonly userId: string;

    constructor(socket: Namespace, userId: string) {
        this.socket = socket;
        this.userId = userId;
    }

    async loadGames() {
        let games = await gameDao.getAll();
        games = games.filter((game: IGame) => {
            return game.phase === GamePhase.Init || (this.userId && game.players.findIndex(p => p.id === this.userId) > -1);
        });
        return games;
    }

    loadGame(gameId: string) {
        return gameDao.getOne(gameId);
    }

    async addGame(game: IGame) {
        if (!game) {
            throw new Error(paramMissingError);
        }

        if (!game.id) game.id = generateId();
        if (!game.hostId) game.hostId = this.userId;

        const createdGame = await gameDao.add(game);

        this.socket.to(ROOM_GAME_LIST).emit(GameEvent.UpdateList);

        return createdGame.id as string;
    }

    async startPreparation(gameId: string, wordsPerPlayer: number) {
        const game = await gameDao.getOne(gameId);
        if (!game) {
            throw new Error(gameNotFoundError);
        }
        if (game.hostId !== this.userId) {
            throw new Error(forbiddenError);
        }

        GameController.goToPreparation(game, wordsPerPlayer);

        await gameDao.update(game);

        this.socket.to(ROOM_GAME(game.id)).emit(GameEvent.Update, game);

        return true;
    };

    async addPlayer(gameId: string, player: IUser) {
        const game = await gameDao.getOne(gameId);

        if (!player) throw new Error(paramMissingError);
        if (!game) throw new Error(gameNotFoundError);

        if (!player.id) player.id = this.userId;
        GameController.addPlayer(game, player);

        await gameDao.update(game);

        this.socket.to(ROOM_GAME(game.id)).emit(GameEvent.Update, game);

        return true;
    };

    async updatePlayer(gameId: string, player: IUser) {
        const game = await gameDao.getOne(gameId);

        if (!player) throw new Error(paramMissingError);
        if (player.id !== this.userId) throw new Error(forbiddenError);
        if (!game) throw new Error(gameNotFoundError);

        GameController.updatePlayer(game, player);

        await gameDao.update(game);

        this.socket.to(ROOM_GAME(game.id)).emit(GameEvent.Update, game);

        return true;
    };

    async submitHint(gameId: string, hint: string) {
        const game = await gameDao.getOne(gameId);

        if (!hint) throw new Error(paramMissingError);
        if (!game) throw new Error(gameNotFoundError);
        if (game.players.findIndex((p: IUser) => p.id === this.userId) === -1) {
            throw new Error(forbiddenError);
        }

        GameController.addHint(game, hint, this.userId);

        await gameDao.update(game);

        this.socket.to(ROOM_GAME(game.id)).emit(GameEvent.Update, game);

        return true;
    };

    async toggleDuplicateHint(gameId: string, hintIndex: number) {
        const game = await gameDao.getOne(gameId);

        if (!game) throw new Error(gameNotFoundError);
        if (game.rounds[game.round].hostId !== this.userId) throw new Error(forbiddenError);

        GameController.toggleDuplicateHint(game, hintIndex);

        await gameDao.update(game);

        this.socket.to(ROOM_GAME(game.id)).emit(GameEvent.Update, game);

        return true;
    };

    async showHints(gameId: string) {
        const game = await gameDao.getOne(gameId);

        if (!game) throw new Error(gameNotFoundError);
        if (game.rounds[game.round].hostId !== this.userId) throw new Error(forbiddenError);

        GameController.showHints(game);

        await gameDao.update(game);

        this.socket.to(ROOM_GAME(game.id)).emit(GameEvent.Update, game);

        return true;
    };

    async guess(gameId: string, guess: string) {
        const game = await gameDao.getOne(gameId);

        if (!guess) throw new Error(paramMissingError);
        if (!game) throw new Error(gameNotFoundError);
        if (game.rounds[game.round].guesserId !== this.userId) throw new Error(forbiddenError);

        GameController.guess(game, guess);

        await gameDao.update(game);

        this.socket.to(ROOM_GAME(game.id)).emit(GameEvent.Update, game);

        return true;
    };

    async resolveRound(gameId: string, correct: boolean|undefined) {
        const game = await gameDao.getOne(gameId);

        if (!game) throw new Error(gameNotFoundError);
        if (game.players.findIndex((p: IUser) => p.id === this.userId) === -1) throw new Error(forbiddenError);

        GameController.resolveRound(game, !!correct);

        await gameDao.update(game);

        this.socket.to(ROOM_GAME(game.id)).emit(GameEvent.Update, game);

        return true;
    };

    async deleteGame(gameId: string) {
        const game = await gameDao.getOne(gameId);

        if (!game) throw new Error(gameNotFoundError);
        if (game.hostId !== this.userId) throw new Error(forbiddenError);

        await gameDao.delete(gameId);

        this.socket.to(ROOM_GAME_LIST).emit(GameEvent.UpdateList);

        return true;
    };
}


/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default GameApi;
