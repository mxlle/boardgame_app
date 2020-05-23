import { Schema } from "mongoose";

export const WordResultSchema: Schema = new Schema({
    word: String,
    guess: String,
});
export const UserSchema: Schema = new Schema({
    id: String,
    name: String,
    color: {type: String, required: false},
    enteredWords: [{type: String, required: false}]
});
export const HintSchema: Schema = new Schema({
    hint: String,
    author: String,
    isDuplicate: {type: Boolean, required: false}
});

export const GameSchema: Schema = new Schema({
    id: String,
    name: String,
    words: [String],
    players: [UserSchema],
    host: String,
    wordsPerPlayer: Number,

    round: Number,
    phase: Number,
    currentWord: {type: String, required: false},
    currentGuesser: {type: String, required: false},
    currentGuess: {type: String, required: false},
    guessedRight: {type: Boolean, required: false},
    hints: [HintSchema],
    correctWords: [WordResultSchema],
    wrongWords: [WordResultSchema],
});
