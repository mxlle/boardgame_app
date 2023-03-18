import {Schema} from 'mongoose';
import {getPlayersWithRequiredAction, isSinglePlayerGame} from '@gameFunctions';

export const UserSchema: Schema = new Schema({
    id: String,
    name: String,
    color: {type: String, required: false},
    enteredWords: [{type: String, required: false}],
    isAi: {type: Boolean, required: false},
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

export const JoiningRequestSchema: Schema = new Schema({
    id: String,
    oldPlayerId: String,
    oldPlayerName: String,
    newPlayer: UserSchema,
    joinAsNewPlayer: {type: Boolean, required: false},
    accepted: {type: Boolean, required: false},
    denied: {type: Boolean, required: false}
});

const GameSchema: Schema = new Schema({
    id: String,
    name: String,
    players: [UserSchema],
    hostId: String,
    wordsPerPlayer: Number,
    language: String,

    round: Number,
    phase: Number,

    rounds: [RoundSchema],

    joiningRequests: { type: [JoiningRequestSchema], default: [] },

    creationTime: Date,
    startTime: Date,
    endTime: Date,

    rematchId: String,

    isTwoPlayerVariant: {type: Boolean, required: false},
    openAiKey: {type: String, required: false},
}, { toJSON: { virtuals: true } });

GameSchema.virtual('actionRequiredFrom').get(function() {
    // @ts-ignore
    return getPlayersWithRequiredAction(this);
});

GameSchema.virtual('isSinglePlayerGame').get(function() {
    // @ts-ignore
    return isSinglePlayerGame(this);
});

export {GameSchema};
