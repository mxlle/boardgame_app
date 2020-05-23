import { Document } from 'mongoose';

export interface IUser extends Document {
    id: string;
    name: string;
    color?: string;
    enteredWords?: string[];
}
