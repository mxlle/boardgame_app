import { Document } from 'mongoose';
import {
    IGame as IGameBase, IUser, GamePhase, WordResult, DEFAULT_NUM_WORDS
} from '@gameTypes';

type IGame = IGameBase & Document;
export { IGame, GamePhase, IUser };

export * as GameController from '@gameFunctions';
