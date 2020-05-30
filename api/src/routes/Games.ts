import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, OK, NOT_FOUND, FORBIDDEN } from 'http-status-codes';
import { ParamsDictionary } from 'express-serve-static-core';
import { generateId } from '@shared/functions';

import GameDao from '@daos/Game';
import * as GameController from '@entities/Game';
import { IUser } from "@entities/User";
import { paramMissingError, gameNotFoundError, forebiddenError } from '@shared/constants';

// Init shared
const router = Router();
const gameDao = new GameDao();


/******************************************************************************
 *                      Get All Games - "GET /api/games/all"
 ******************************************************************************/

// Generate userId if none has been set
router.use(function(req: Request, res: Response, next) {
    if (!req.signedCookies.userId) {
        req.signedCookies.userId = generateId();
        res.cookie('userId', req.signedCookies.userId, {
            sameSite: true,
            signed: true,
        });
    }
    console.log(req.signedCookies.userId);
    next();
});

router.get('/all', async (req: Request, res: Response) => {
    const userId = req.signedCookies.userId;
    let games = await gameDao.getAll();
    games = games.filter((game: GameController.IGame) => {
        return game.phase === GameController.GamePhase.Init || (userId && game.players.findIndex(p => p.id === userId) > -1);
    });
    return res.status(OK).json({games});
});

/******************************************************************************
 *                      Get One - "GET /api/games/:id"
 ******************************************************************************/

router.get('/:id', async (req: Request, res: Response) => {
    const game = await gameDao.getOne(req.params.id);
    return res.status(OK).json({game});
});

/******************************************************************************
 *                       Add One - "POST /api/games/add"
 ******************************************************************************/

router.post('/add', async (req: Request, res: Response) => {
    const { game } = req.body;
    const userId = req.signedCookies.userId;
    if (!game) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        });
    }

    if (!game.id) game.id = generateId();
    if (!game.host) game.host = userId;

    await gameDao.add(game);
    return res.status(CREATED).json({id: game.id, playerId: game.host});
});


/******************************************************************************
 *                       Update - "PUT /api/games/update"
 ******************************************************************************/

router.put('/update', async (req: Request, res: Response) => {
    const { game } = req.body;
    if (!game) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        });
    }
    await gameDao.update(game);
    return res.status(OK).end();
});

/******************************************************************************
 *              Start preparation - "PUT /api/games/:id/startPreparation"
 ******************************************************************************/

router.put('/:id/startPreparation', async (req: Request, res: Response) => {
    const { wordsPerPlayer } = req.body;
    const userId = req.signedCookies.userId;
    const game = await gameDao.getOne(req.params.id);
    if (!game) {
        return res.status(NOT_FOUND).json({
            error: gameNotFoundError,
        });
    }
    if (game.host !== userId) {
        return res.status(FORBIDDEN).json({
            error: forebiddenError,
        });
    }

    GameController.goToPreparation(game, wordsPerPlayer);

    await gameDao.update(game);
    return res.status(OK).end();
});

/******************************************************************************
 *          Add player to game - "PUT /api/games/:id/addPlayer"
 ******************************************************************************/

router.put('/:id/addPlayer', async (req: Request, res: Response) => {
    const { player } = req.body;
    const userId = req.signedCookies.userId;
    const game = await gameDao.getOne(req.params.id);
    if (!player) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        });
    }
    if (!game) {
        return res.status(NOT_FOUND).json({
            error: gameNotFoundError,
        });
    }

    if (!player.id) player.id = userId;
    GameController.addPlayer(game, player);

    await gameDao.update(game);
    return res.status(OK).json({player: player});
});

/******************************************************************************
 *          Update player in game - "PUT /api/games/:id/updatePlayer"
 ******************************************************************************/

router.put('/:id/updatePlayer', async (req: Request, res: Response) => {
    const { player } = req.body;
    const userId = req.signedCookies.userId;
    const game = await gameDao.getOne(req.params.id);
    if (!player) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        });
    }
    if (player.id !== userId) {
        return res.status(FORBIDDEN).json({
            error: forebiddenError,
        });
    }
    if (!game) {
        return res.status(NOT_FOUND).json({
            error: gameNotFoundError,
        });
    }

    GameController.updatePlayer(game, player);

    await gameDao.update(game);
    return res.status(OK).json({player: player});
});

/******************************************************************************
 *                      Send hint - "PUT /api/games/:id/hint"
 ******************************************************************************/

router.put('/:id/hint', async (req: Request, res: Response) => {
    const { hint } = req.body;
    const userId = req.signedCookies.userId;
    const game = await gameDao.getOne(req.params.id);
    if (!hint) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        });
    }
    if (!game) {
        return res.status(NOT_FOUND).json({
            error: gameNotFoundError,
        });
    }
    if (game.players.findIndex((p: IUser) => p.id === userId) === -1) {
        return res.status(FORBIDDEN).json({
            error: forebiddenError,
        });
    }

    GameController.addHint(game, hint, userId);

    await gameDao.update(game);
    return res.status(OK).end();
});

/******************************************************************************
 *                      Send hint - "PUT /api/games/:id/toggleDuplicateHint"
 ******************************************************************************/

router.put('/:id/toggleDuplicateHint', async (req: Request, res: Response) => {
    const { hintIndex } = req.body;
    const userId = req.signedCookies.userId;
    const game = await gameDao.getOne(req.params.id);
    if (!game) {
        return res.status(NOT_FOUND).json({
            error: gameNotFoundError,
        });
    }
    if (game.roundHost !== userId) {
        return res.status(FORBIDDEN).json({
            error: forebiddenError,
        });
    }

    GameController.toggleDuplicateHint(game, hintIndex);

    await gameDao.update(game);
    return res.status(OK).end();
});

/******************************************************************************
 *                      Send hint - "PUT /api/games/:id/showHints"
 ******************************************************************************/

router.put('/:id/showHints', async (req: Request, res: Response) => {
    const game = await gameDao.getOne(req.params.id);
    const userId = req.signedCookies.userId;
    if (!game) {
        return res.status(NOT_FOUND).json({
            error: gameNotFoundError,
        });
    }
    if (game.roundHost !== userId) {
        return res.status(FORBIDDEN).json({
            error: forebiddenError,
        });
    }

    GameController.showHints(game);

    await gameDao.update(game);
    return res.status(OK).end();
});

/******************************************************************************
 *                      Send hint - "PUT /api/games/:id/guess"
 ******************************************************************************/

router.put('/:id/guess', async (req: Request, res: Response) => {
    const { guess } = req.body;
    const userId = req.signedCookies.userId;
    const game = await gameDao.getOne(req.params.id);
    if (!guess) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        });
    }
    if (!game) {
        return res.status(NOT_FOUND).json({
            error: gameNotFoundError,
        });
    }
    if (game.currentGuesser !== userId) {
        return res.status(FORBIDDEN).json({
            error: forebiddenError,
        });
    }

    GameController.guess(game, guess);

    await gameDao.update(game);
    return res.status(OK).end();
});

/******************************************************************************
 *                      Send hint - "PUT /api/games/:id/resolve"
 ******************************************************************************/

router.put('/:id/resolve', async (req: Request, res: Response) => {
    const { correct } = req.body;
    const userId = req.signedCookies.userId;
    const game = await gameDao.getOne(req.params.id);
    if (!game) {
        return res.status(NOT_FOUND).json({
            error: gameNotFoundError,
        });
    }
    if (game.players.findIndex((p: IUser) => p.id === userId) === -1) {
        return res.status(FORBIDDEN).json({
            error: forebiddenError,
        });
    }

    GameController.resolveRound(game, !!correct);

    await gameDao.update(game);
    return res.status(OK).end();
});

/******************************************************************************
 *                    Delete - "DELETE /api/games/delete/:id"
 ******************************************************************************/

router.delete('/delete/:id', async (req: Request, res: Response) => {
    const { id } = req.params as ParamsDictionary;
    const userId = req.signedCookies.userId;
    const game = await gameDao.getOne(req.params.id);
    if (!game) {
        return res.status(NOT_FOUND).json({
            error: gameNotFoundError,
        });
    }
    if (game.host !== userId) {
        return res.status(FORBIDDEN).json({
            error: forebiddenError,
        });
    }
    await gameDao.delete(id);
    return res.status(OK).end();
});


/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router;
