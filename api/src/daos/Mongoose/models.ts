import mongoose from "mongoose";
import { UserSchema, GameSchema } from "./schemas";
import { IGame } from "@entities/Game";
import { IUser } from "@entities/User";

mongoose.connect(process.env.DB_CONNSTR || '', {useNewUrlParser: true});
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

const GameModel = mongoose.model<IGame>('Game', GameSchema);
const UserModel = mongoose.model<IUser>('User', UserSchema);


export { GameModel, UserModel };

