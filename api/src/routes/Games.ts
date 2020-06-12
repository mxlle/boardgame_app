import { generateId } from '@shared/functions';

import GameDao from '@daos/Game';
import { GameController, IGame, IUser, GamePhase } from "@entities/Game";
import { paramMissingError, gameNotFoundError, forbiddenError } from '@shared/constants';
import {Namespace, Socket} from "socket.io";

// Init shared
const gameDao = new GameDao();

type ApiController = {
    [action: string]: (socket: Socket|Namespace, auth: string, params?: any) => Promise<any>
}
const GameApi: ApiController = {};

const lobbyRoom = 'lobby';
const gameRoom = (gameId: string|number) => `game.${gameId}`;

/******************************************************************************
 *                      Get All Games - "GET /api/games/all"
 ******************************************************************************/
GameApi.allGames = async function(socket, userId) {
    let games = await gameDao.getAll();
    games = games.filter((game: IGame) => {
        return game.phase === GamePhase.Init || (userId && game.players.findIndex(p => p.id === userId) > -1);
    });
    return {games};
}

/******************************************************************************
 *                      Get One - "GET /api/games/:id"
 ******************************************************************************/

GameApi.loadGame = async function(socket, userId, { gameId }: {gameId: string}) {
    const game = await gameDao.getOne(gameId);
    return {game};
}

/******************************************************************************
 *                       Add One - "POST /api/games/add"
 ******************************************************************************/

GameApi.addGame = async function(socket, userId, { game }: {game: IGame}) {
    if (!game) {
        throw new Error(paramMissingError);
    }

    if (!game.id) game.id = generateId();
    if (!game.hostId) game.hostId = userId;

    game = await gameDao.add(game);

    // Alle Spieler informieren
    socket.to(lobbyRoom).emit('updateGameList');

    return {id: game.id, playerId: game.hostId};
}


/******************************************************************************
 *                       Update - "PUT /api/games/update"
 ******************************************************************************/
GameApi.updateGame = async function(socket, userId, { game }: { game: IGame }) {
    if (!game) {
        throw new Error(paramMissingError);
    }
    game = await gameDao.update(game);

    // Alle Spieler informieren
    socket.to(gameRoom(game.id)).emit('updateGame', game);

    return true;
}

/******************************************************************************
 *              Start preparation - "PUT /api/games/:id/startPreparation"
 ******************************************************************************/

GameApi.startPreparation = async function(socket, userId, { gameId, wordsPerPlayer }) {
    const game = await gameDao.getOne(gameId);
    if (!game) {
        throw new Error(gameNotFoundError);
    }
    if (game.hostId !== userId) {
        throw new Error(forbiddenError);
    }

    GameController.goToPreparation(game, wordsPerPlayer);

    await gameDao.update(game);

    // Alle Spieler informieren
    socket.to(gameRoom(game.id)).emit('updateGame', game);

    return true;
};

/******************************************************************************
 *          Add player to game - "PUT /api/games/:id/addPlayer"
 ******************************************************************************/

GameApi.addPlayer = async function(socket, userId, { gameId, player }) {
    const game = await gameDao.getOne(gameId);

    if (!player) throw new Error(paramMissingError);
    if (!game) throw new Error(gameNotFoundError);

    if (!player.id) player.id = userId;
    GameController.addPlayer(game, player);

    await gameDao.update(game);

    // Alle Spieler informieren
    socket.to(gameRoom(game.id)).emit('updateGame', game);

    return {player};
};

/******************************************************************************
 *          Update player in game - "PUT /api/games/:id/updatePlayer"
 ******************************************************************************/

GameApi.updatePlayer = async function(socket, userId, { gameId, player }) {
    const game = await gameDao.getOne(gameId);

    if (!player) throw new Error(paramMissingError);
    if (player.id !== userId) throw new Error(forbiddenError);
    if (!game) throw new Error(gameNotFoundError);

    GameController.updatePlayer(game, player);

    await gameDao.update(game);

    // Alle Spieler informieren
    socket.to(gameRoom(game.id)).emit('updateGame', game);

    return {player};
};

/******************************************************************************
 *                      Send hint - "PUT /api/games/:id/hint"
 ******************************************************************************/

GameApi.hint = async function(socket, userId, { gameId, hint }) {
    const game = await gameDao.getOne(gameId);

    if (!hint) throw new Error(paramMissingError);
    if (!game) throw new Error(gameNotFoundError);
    if (game.players.findIndex((p: IUser) => p.id === userId) === -1) {
        throw new Error(forbiddenError);
    }

    GameController.addHint(game, hint, userId);

    await gameDao.update(game);

    // Alle Spieler informieren
    socket.to(gameRoom(game.id)).emit('updateGame', game);

    return true;
};

/******************************************************************************
 *                      Send hint - "PUT /api/games/:id/toggleDuplicateHint"
 ******************************************************************************/

GameApi.toggleDuplicateHint = async function(socket, userId, { gameId, hintIndex }) {
    const game = await gameDao.getOne(gameId);

    if (!game) throw new Error(gameNotFoundError);
    if (game.rounds[game.round].hostId !== userId) throw new Error(forbiddenError);

    GameController.toggleDuplicateHint(game, hintIndex);

    await gameDao.update(game);

    // Alle Spieler informieren
    socket.to(gameRoom(game.id)).emit('updateGame', game);

    return true;
};

/******************************************************************************
 *                      Send hint - "PUT /api/games/:id/showHints"
 ******************************************************************************/

GameApi.showHints = async function(socket, userId, { gameId }) {
    const game = await gameDao.getOne(gameId);

    if (!game) throw new Error(gameNotFoundError);
    if (game.rounds[game.round].hostId !== userId) throw new Error(forbiddenError);

    GameController.showHints(game);

    await gameDao.update(game);

    // Alle Spieler informieren
    socket.to(gameRoom(game.id)).emit('updateGame', game);

    return true;
};

/******************************************************************************
 *                      Send hint - "PUT /api/games/:id/guess"
 ******************************************************************************/

GameApi.guess = async function(socket, userId, { gameId, guess }) {
    const game = await gameDao.getOne(gameId);

    if (!guess) throw new Error(paramMissingError);
    if (!game) throw new Error(gameNotFoundError);
    if (game.rounds[game.round].guesserId !== userId) throw new Error(forbiddenError);

    GameController.guess(game, guess);

    await gameDao.update(game);

    // Alle Spieler informieren
    socket.to(gameRoom(game.id)).emit('updateGame', game);

    return true;
};

/******************************************************************************
 *                      Send hint - "PUT /api/games/:id/resolve"
 ******************************************************************************/

GameApi.resolveRound = async function(socket, userId, { gameId, correct }) {
    const game = await gameDao.getOne(gameId);

    if (!game) throw new Error(gameNotFoundError);
    if (game.players.findIndex((p: IUser) => p.id === userId) === -1) throw new Error(forbiddenError);

    GameController.resolveRound(game, !!correct);

    await gameDao.update(game);

    // Alle Spieler informieren
    socket.to(gameRoom(game.id)).emit('updateGame', game);

    return true;
};

/******************************************************************************
 *                    Delete - "DELETE /api/games/delete/:id"
 ******************************************************************************/

GameApi.delete = async function(socket, userId, { gameId }) {
    const game = await gameDao.getOne(gameId);

    if (!game) throw new Error(gameNotFoundError);
    if (game.hostId !== userId) throw new Error(forbiddenError);

    await gameDao.delete(gameId);

    // Alle Spieler informieren
    socket.to(lobbyRoom).emit('updateGameList');

    return true;
};


/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default GameApi;
