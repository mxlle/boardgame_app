import { IGame } from '@entities/Game';
import { GameModel } from "@daos/Mongoose/models";

export interface IGameDao {
    getOne: (id: string) => Promise<IGame | null>;
    getAll: () => Promise<IGame[]>;
    add: (game: IGame) => Promise<IGame>;
    update: (game: IGame) => Promise<IGame>;
    delete: (id: string) => Promise<void>;
}

class GameDao implements IGameDao {

    public async getOne(id: string): Promise<IGame | null> {
        return await GameModel.findOne({id: id}).exec();
    }


    /**
     *
     */
    public async getAll(): Promise<IGame[]> {
        return await GameModel.find().exec();
    }


    /**
     *
     * @param game
     */
    public async add(game: IGame): Promise<IGame> {
        return await new GameModel(game).save();
    }


    /**
     *
     * @param game
     */
    public async update(game: IGame): Promise<IGame> {
        return await game.save();
    }


    /**
     *
     * @param id
     */
    public async delete(id: string): Promise<void> {
        await GameModel.findOneAndDelete({id: id});
    }
}

export default GameDao;
