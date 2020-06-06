import { Document } from 'mongoose';
import { IUser } from '@entities/Game';

export type IUserDocument = IUser & Document;