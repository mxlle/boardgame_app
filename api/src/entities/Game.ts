import { Document } from 'mongoose';
import {
    IGame as IGameBase, IUser, GamePhase
} from '@gameTypes';

type IGame = IGameBase & Document;
export { IGameBase, IGame, GamePhase, IUser };

export * as GameController from '@gameFunctions';
