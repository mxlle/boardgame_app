import mongoose from "mongoose";
import { UserSchema, GameSchema } from "./schemas";
import { IGame } from "@entities/Game";
import { IUserDocument } from "@entities/User";

mongoose.connect(process.env.DB_CONNSTR || '', {useNewUrlParser: true});
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

const GameModel = mongoose.model<IGame>('Game', GameSchema);
const UserModel = mongoose.model<IUserDocument>('User', UserSchema);


export { GameModel, UserModel };

