import { Schema } from 'mongoose';

export const UserSchema: Schema = new Schema({
    id: String,
    name: String,
    color: {type: String, required: false},
    enteredWords: [{type: String, required: false}]
});

export const HintSchema: Schema = new Schema({
    id: String,
    hint: String,
    authorId: String,
    isDuplicate: {type: Boolean, required: false}
});

export const RoundSchema: Schema = new Schema({
    word: String,
    authorId: String,
    guesserId: String,
    hostId: String,
    hints: [HintSchema],
    guess: String,
    correct: {type: Boolean, required: false},
    countAnyway: {type: Boolean, required: false}
});

export const GameSchema: Schema = new Schema({
    id: String,
    name: String,
    players: [UserSchema],
    hostId: String,
    wordsPerPlayer: Number,
    language: String,

    round: Number,
    phase: Number,

    rounds: [RoundSchema],

    startTime: Date,
    endTime: Date,

    isTwoPlayerVariant: {type: Boolean, required: false}
});
