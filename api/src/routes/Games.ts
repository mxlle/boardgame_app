import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, OK, NOT_FOUND } from 'http-status-codes';
import { ParamsDictionary } from 'express-serve-static-core';
const uuid4 = require('uuid4');

import GameDao from '@daos/Game/GameDao.mock';
import * as GameController from '@entities/Game';
import { paramMissingError, gameNotFoundError } from '@shared/constants';

// Init shared
const router = Router();
const gameDao = new GameDao();


/******************************************************************************
 *                      Get All Games - "GET /api/games/all"
 ******************************************************************************/

router.get('/all', async (req: Request, res: Response) => {
    const games = await gameDao.getAll();
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
    if (!game) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        });
    }

    if (!game.id) game.id = uuid4();

    await gameDao.add(game);
    return res.status(CREATED).json({id: game.id});
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
 *                      Add player to game - "PUT /api/games/:id/addPlay"
 ******************************************************************************/

router.put('/:id/addPlayer', async (req: Request, res: Response) => {
    const { player } = req.body;
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

    if (!player.id) player.id = uuid4();

    game.players.push(player);

    await gameDao.update(game);
    return res.status(OK).json({id: player.id});
});

/******************************************************************************
 *                      Start game - "PUT /api/games/:id/start"
 ******************************************************************************/

router.put('/:id/start', async (req: Request, res: Response) => {
    const game = await gameDao.getOne(req.params.id);
    if (!game) {
        return res.status(NOT_FOUND).json({
            error: gameNotFoundError,
        });
    }

    GameController.startGame(game);

    await gameDao.update(game);
    return res.status(OK).end();
});

/******************************************************************************
 *                      Send hint - "PUT /api/games/:id/hint"
 ******************************************************************************/

router.put('/:id/hint', async (req: Request, res: Response) => {
    const { hint } = req.body;
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

    GameController.addHint(game, hint.hint, hint.author.id);

    await gameDao.update(game);
    return res.status(OK).end();
});

/******************************************************************************
 *                      Send hint - "PUT /api/games/:id/showHints"
 ******************************************************************************/

router.put('/:id/showHints', async (req: Request, res: Response) => {
    const game = await gameDao.getOne(req.params.id);
    if (!game) {
        return res.status(NOT_FOUND).json({
            error: gameNotFoundError,
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

    GameController.guess(game, guess);

    await gameDao.update(game);
    return res.status(OK).end();
});

/******************************************************************************
 *                    Delete - "DELETE /api/games/delete/:id"
 ******************************************************************************/

router.delete('/delete/:id', async (req: Request, res: Response) => {
    const { id } = req.params as ParamsDictionary;
    await gameDao.delete(id);
    return res.status(OK).end();
});


/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router;
