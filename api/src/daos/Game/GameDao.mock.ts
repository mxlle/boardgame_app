import { IGame } from '@entities/Game';
import { MockDaoMock } from '../MockDb/MockDao.mock';
import { IGameDao } from './GameDao';
import { generateId } from '@shared/functions';


class GameDao extends MockDaoMock implements IGameDao {


    public async getOne(id: string): Promise<IGame | null> {
        try {
            const db = await super.openDb();
            for (const game of db.games) {
                if (game.id === id) {
                    return game;
                }
            }
            return null;
        } catch (err) {
            throw err;
        }
    }


    public async getAll(): Promise<IGame[]> {
        try {
            const db = await super.openDb();
            return db.games;
        } catch (err) {
            throw err;
        }
    }


    public async add(game: IGame): Promise<void> {
        try {
            const db = await super.openDb();
            if (!game.id) game.id = generateId();
            if (!db.games) db.games = [];
            db.games.push(game);
            await super.saveDb(db);
        } catch (err) {
            throw err;
        }
    }


    public async update(game: IGame): Promise<void> {
        try {
            const db = await super.openDb();
            for (let i = 0; i < db.games.length; i++) {
                if (db.games[i].id === game.id) {
                    db.games[i] = game;
                    await super.saveDb(db);
                    return;
                }
            }
            throw new Error('Game not found');
        } catch (err) {
            throw err;
        }
    }


    public async delete(id: string): Promise<void> {
        try {
            const db = await super.openDb();
            for (let i = 0; i < db.games.length; i++) {
                if (db.games[i].id === id) {
                    db.games.splice(i, 1);
                    await super.saveDb(db);
                    return;
                }
            }
            throw new Error('Game not found');
        } catch (err) {
            throw err;
        }
    }
}

export default GameDao;
