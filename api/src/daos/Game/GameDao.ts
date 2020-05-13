import { IGame } from '@entities/Game';


export interface IGameDao {
    getOne: (id: string) => Promise<IGame | null>;
    getAll: () => Promise<IGame[]>;
    add: (game: IGame) => Promise<void>;
    update: (game: IGame) => Promise<void>;
    delete: (id: string) => Promise<void>;
}

class GameDao implements IGameDao {


    /**
     * @param email
     */
    public async getOne(id: string): Promise<IGame | null> {
        // TODO
        return [] as any;
    }


    /**
     *
     */
    public async getAll(): Promise<IGame[]> {
        // TODO
        return [] as any;
    }


    /**
     *
     * @param game
     */
    public async add(game: IGame): Promise<void> {
        // TODO
        return {} as any;
    }


    /**
     *
     * @param game
     */
    public async update(game: IGame): Promise<void> {
        // TODO
        return {} as any;
    }


    /**
     *
     * @param id
     */
    public async delete(id: string): Promise<void> {
        // TODO
        return {} as any;
    }
}

export default GameDao;
