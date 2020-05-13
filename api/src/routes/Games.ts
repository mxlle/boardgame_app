import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';
import { ParamsDictionary } from 'express-serve-static-core';

import GameDao from '@daos/Game/GameDao.mock';
import { paramMissingError } from '@shared/constants';

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
 *                       Add One - "POST /api/games/add"
 ******************************************************************************/

router.post('/add', async (req: Request, res: Response) => {
    const { game } = req.body;
    if (!game) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        });
    }
    await gameDao.add(game);
    return res.status(CREATED).end();
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
