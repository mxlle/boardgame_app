import { IUserDocument as IUser } from '@entities/User';
import { UserModel } from "@daos/Mongoose/models";

export interface IUserDao {
    getOne: (email: string) => Promise<IUser | null>;
    getAll: () => Promise<IUser[]>;
    add: (user: IUser) => Promise<void>;
    update: (user: IUser) => Promise<void>;
    delete: (id: string) => Promise<void>;
}

class UserDao implements IUserDao {


    /**
     * @param email
     */
    public async getOne(email: string): Promise<IUser | null> {
        return await UserModel.findOne({email: email}).exec();
    }


    /**
     *
     */
    public async getAll(): Promise<IUser[]> {
        return await UserModel.find().exec();
    }


    /**
     *
     * @param user
     */
    public async add(user: IUser): Promise<void> {
        await new UserModel(user).save();
    }


    /**
     *
     * @param user
     */
    public async update(user: IUser): Promise<void> {
        await user.save();
    }


    /**
     *
     * @param id
     */
    public async delete(id: string): Promise<void> {
        await UserModel.findOneAndDelete({id: id});
    }
}

export default UserDao;
