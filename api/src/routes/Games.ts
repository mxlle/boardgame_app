import {generateId} from '@shared/functions';

import GameDao from '@daos/Game';
import {GameController, GamePhase, IUser} from '@entities/Game';
import {forbiddenError, gameNotFoundError, paramMissingError, takeOverRequestNotFoundError} from '@shared/constants';
import {Namespace} from 'socket.io';
import {GameEvent, IGame, IGameApi, NotificationEventOptions, ROOM_GAME, ROOM_GAME_LIST} from '@gameTypes';
import words from '@shared/Words';
import {getClearedForDeletion} from '@gameFunctions';

// Init shared
const gameDao = new GameDao();

class GameApi implements IGameApi {
    private socket: Namespace;
    private readonly userId: string;

    constructor(socket: Namespace, userId: string) {
        this.socket = socket;
        this.userId = userId;
    }

    async loadGames() {
        let games = await gameDao.getAll();
        games = games.filter((game: IGame) => {
            return game.phase === GamePhase.Init || (this.userId && game.players.findIndex(p => p.id === this.userId) > -1);
        });
        return games;
    }

    loadGame(gameId: string) {
        return gameDao.getOne(gameId);
    }

    async addGame(game: IGame, previousGameId?: string) {
        if (!game) {
            throw new Error(paramMissingError);
        }

        if (!game.id) game.id = generateId();
        if (!game.hostId) game.hostId = this.userId;
        game.creationTime = new Date();

        const createdGame = await gameDao.add(game);

        this.socket.to(ROOM_GAME_LIST).emit(GameEvent.UpdateList);

        if (previousGameId) {
            const previousGame = await gameDao.getOne(previousGameId);
            if (!!previousGame) {
                previousGame.rematchId = game.id;
                await gameDao.update(previousGame);
                this.socket.to(ROOM_GAME(previousGame.id)).emit(GameEvent.Update, previousGame);
            }
        }

        return createdGame.id as string;
    }

    async startPreparation(gameId: string, wordsPerPlayer: number, isTwoPlayerVariant: boolean = false) {
        const game = await gameDao.getOne(gameId);
        if (!game) {
            throw new Error(gameNotFoundError);
        }
        if (game.hostId !== this.userId) {
            throw new Error(forbiddenError);
        }

        if (isTwoPlayerVariant) {
            for (const player of game.players) {
                player.enteredWords = [];
                for (let j = 0; j < wordsPerPlayer; j++) {
                    player.enteredWords.push(words.getRandom(game.language));
                }
            }
        }

        GameController.goToPreparation(game, wordsPerPlayer, isTwoPlayerVariant);

        await gameDao.update(game);

        this.socket.to(ROOM_GAME(game.id)).emit(GameEvent.Update, game);

        return true;
    };

    async backToLobby(gameId: string) {
        const game = await gameDao.getOne(gameId);
        if (!game) throw new Error(gameNotFoundError);
        if (game.hostId !== this.userId) throw new Error(forbiddenError);

        GameController.backToLobby(game);

        await gameDao.update(game);

        this.socket.to(ROOM_GAME(game.id)).emit(GameEvent.Update, game);

        return true;
    };

    async addPlayer(gameId: string, player: IUser) {
        const game = await gameDao.getOne(gameId);

        if (!player) throw new Error(paramMissingError);
        if (!game) throw new Error(gameNotFoundError);

        if (!player.id) player.id = this.userId;
        GameController.addPlayer(game, player);

        await gameDao.update(game);

        this.socket.to(ROOM_GAME(game.id)).emit(GameEvent.Update, game);
        this.socket.to(ROOM_GAME_LIST).emit(GameEvent.UpdateList);

        return true;
    };

    async updatePlayer(gameId: string, player: IUser) {
        const game = await gameDao.getOne(gameId);

        if (!player) throw new Error(paramMissingError);
        if (player.id !== this.userId) throw new Error(forbiddenError);
        if (!game) throw new Error(gameNotFoundError);

        GameController.updatePlayer(game, player);

        await gameDao.update(game);

        this.socket.to(ROOM_GAME(game.id)).emit(GameEvent.Update, game);
        if (game.phase === GamePhase.HintWriting) {
            // send notification for next phase
            const options: NotificationEventOptions = {
                transKey: 'GAME.MESSAGE.YOUR_TURN_HINT_WRITING',
                audience: game.players.filter(p => p.id !== game.rounds[game.round].guesserId).map(p => p.id)
            };
            this.socket.to(ROOM_GAME(game.id)).emit(GameEvent.Notification, options);
        }

        return true;
    };

    async removePlayerFromGame(gameId: string, playerId: string) {
        const game = await gameDao.getOne(gameId);

        if (!game) throw new Error(gameNotFoundError);
        if (!playerId) throw new Error(paramMissingError);
        if (playerId !== this.userId && this.userId !== game.hostId) throw new Error(forbiddenError);

        GameController.removePlayerFromGame(game, playerId);

        await gameDao.update(game);

        this.socket.to(ROOM_GAME(game.id)).emit(GameEvent.Update, game);

        return true;
    }

    async requestTakeOver(gameId: string, oldPlayerId: string, newPlayer: IUser) {
        const game = await gameDao.getOne(gameId);

        if (!game) throw new Error(gameNotFoundError);

        if (!newPlayer || !newPlayer.id || !oldPlayerId) throw new Error(paramMissingError);
        const oldPlayerName = game.players.find(p => p.id === oldPlayerId)?.name;
        if (!oldPlayerName || game.players.findIndex(p => p.id === newPlayer.id) > -1) throw new Error(forbiddenError);

        game.takeOverRequests.push({ id: generateId(), oldPlayerId, oldPlayerName, newPlayer });

        await gameDao.update(game);

        this.socket.to(ROOM_GAME(game.id)).emit(GameEvent.Update, game);
        this.socket.to(ROOM_GAME(game.id)).emit(GameEvent.Notification, {
            transKey: 'GAME.MESSAGE.NEW_JOINING_REQUEST',
            audience: [game.hostId, oldPlayerId]
        });

        return true;
    }

    async handleTakeOver(gameId: string, takeOverRequestId: string, deny: boolean = false) {
        const game = await gameDao.getOne(gameId);

        if (!game) throw new Error(gameNotFoundError);
        if (!takeOverRequestId) throw new Error(paramMissingError);
        const takeOverRequest = game.takeOverRequests.find((req) => req.id === takeOverRequestId);
        if (!takeOverRequest) throw new Error(takeOverRequestNotFoundError);
        if (takeOverRequest.oldPlayerId !== this.userId && this.userId !== game.hostId) throw new Error(forbiddenError);

        let notificationOptions: NotificationEventOptions|null = null;

        if (deny && (takeOverRequest.accepted || takeOverRequest.denied)) {
            game.takeOverRequests.splice(game.takeOverRequests.findIndex(req => req.id === takeOverRequestId), 1);
        } else {
            notificationOptions = {
                transKey: '',
                audience: [takeOverRequest.newPlayer.id],
            };
            if (deny) {
                takeOverRequest.denied = true;
                notificationOptions.transKey = 'GAME.MESSAGE.JOINING_REQUEST_DENIED';
                notificationOptions.variant = 'error';
            } else {
                takeOverRequest.accepted = true;
                notificationOptions.transKey = 'GAME.MESSAGE.JOINING_REQUEST_ACCEPTED';
                notificationOptions.variant = 'success';
                GameController.takeOverPlayer(game, takeOverRequest);
            }
        }

        await gameDao.update(game);

        this.socket.to(ROOM_GAME(game.id)).emit(GameEvent.Update, game);
        if (!!notificationOptions) this.socket.to(ROOM_GAME(game.id)).emit(GameEvent.Notification, notificationOptions);

        return true;
    }

    async submitHint(gameId: string, hintId: string, hint: string) {
        const game = await gameDao.getOne(gameId);

        if (!hint || !hintId) throw new Error(paramMissingError);
        if (!game) throw new Error(gameNotFoundError);
        if (game.players.findIndex((p: IUser) => p.id === this.userId) === -1) {
            throw new Error(forbiddenError);
        }

        GameController.addHint(game, hintId, hint, this.userId);

        await gameDao.update(game);

        this.socket.to(ROOM_GAME(game.id)).emit(GameEvent.Update, game);

        if (game.phase === GamePhase.HintComparing) {
            // send notification for next phase
            const options: NotificationEventOptions = {
                transKey: 'GAME.MESSAGE.YOUR_TURN_HINT_COMPARING',
                audience: [game.rounds[game.round].hostId]
            };
            this.socket.to(ROOM_GAME(game.id)).emit(GameEvent.Notification, options);
        }

        return true;
    };

    async resetHint(gameId: string, hintId: string) {
        const game = await gameDao.getOne(gameId);

        if (!hintId) throw new Error(paramMissingError);
        if (!game) throw new Error(gameNotFoundError);
        if (game.players.findIndex((p: IUser) => p.id === this.userId) === -1) {
            throw new Error(forbiddenError);
        }

        GameController.resetHint(game, hintId, this.userId);

        await gameDao.update(game);

        this.socket.to(ROOM_GAME(game.id)).emit(GameEvent.Update, game);

        return true;
    };

    async endHintPhase(gameId: string) {
        const game = await gameDao.getOne(gameId);

        if (!game) throw new Error(gameNotFoundError);
        if (game.hostId !== this.userId) {
            throw new Error(forbiddenError);
        }

        GameController.compareHints(game);

        await gameDao.update(game);

        this.socket.to(ROOM_GAME(game.id)).emit(GameEvent.Update, game);

        return true;
    };

    async toggleDuplicateHint(gameId: string, hintId: string) {
        const game = await gameDao.getOne(gameId);

        if (!game) throw new Error(gameNotFoundError);
        if (game.rounds[game.round].hostId !== this.userId) throw new Error(forbiddenError);

        GameController.toggleDuplicateHint(game, hintId);

        await gameDao.update(game);

        this.socket.to(ROOM_GAME(game.id)).emit(GameEvent.Update, game);

        return true;
    };

    async showHints(gameId: string) {
        const game = await gameDao.getOne(gameId);

        if (!game) throw new Error(gameNotFoundError);
        if (game.rounds[game.round].hostId !== this.userId && game.hostId !== this.userId) throw new Error(forbiddenError);

        GameController.showHints(game);

        await gameDao.update(game);

        this.socket.to(ROOM_GAME(game.id)).emit(GameEvent.Update, game);

        // send notification for next phase
        const options: NotificationEventOptions = {
            transKey: 'GAME.MESSAGE.YOUR_TURN_GUESSING',
            audience: [game.rounds[game.round].guesserId]
        };
        this.socket.to(ROOM_GAME(game.id)).emit(GameEvent.Notification, options);

        return true;
    };

    async guess(gameId: string, guess: string) {
        const game = await gameDao.getOne(gameId);

        if (guess === '' && game?.hostId === this.userId) {
            guess = words.getRandom(game.language);
        }

        if (!guess) throw new Error(paramMissingError);
        if (!game) throw new Error(gameNotFoundError);
        const currentRound = game.rounds[game.round];
        if (currentRound.guesserId !== this.userId && game.hostId !== this.userId) throw new Error(forbiddenError);

        GameController.guess(game, guess);

        await gameDao.update(game);

        this.socket.to(ROOM_GAME(game.id)).emit(GameEvent.Update, game);

        // send notification
        const guesserName = game.players.find(p => p.id === currentRound.guesserId)?.name;
        const options: NotificationEventOptions = {
            transKey: currentRound.correct ? 'GAME.MESSAGE.RESULT_CORRECT' : 'GAME.MESSAGE.RESULT_WRONG',
            tOptions: { guesserName, guess },
            variant: currentRound.correct ? 'success' : 'warning'
        };
        this.socket.to(ROOM_GAME(game.id)).emit(GameEvent.Notification, options);
        if (currentRound.correct) {
            this.socket.to(ROOM_GAME(game.id)).emit(GameEvent.Confetti);
        } else {
            this.socket.to(ROOM_GAME(game.id)).emit(GameEvent.Notification, {
                transKey: 'GAME.MESSAGE.YOUR_TURN_SOLUTION',
                audience: [currentRound.hostId]
            });
        }

        return true;
    };

    async resolveRound(gameId: string, correct: boolean|undefined) {
        const game = await gameDao.getOne(gameId);

        if (!game) throw new Error(gameNotFoundError);
        if (game.players.findIndex((p: IUser) => p.id === this.userId) === -1) throw new Error(forbiddenError);

        // send resolve notification
        if (false === game.rounds[game.round].correct) {
            const word = game.rounds[game.round].guess;
            const options: NotificationEventOptions = {
                transKey: correct ? 'GAME.MESSAGE.PREV_RESULT_CORRECT' : 'GAME.MESSAGE.PREV_RESULT_WRONG',
                tOptions: { word },
                variant: correct ? 'success' : 'error'
            };
            this.socket.to(ROOM_GAME(game.id)).emit(GameEvent.Notification, options);
            if (correct) {
                this.socket.to(ROOM_GAME(game.id)).emit(GameEvent.Confetti);
            }
        }

        GameController.resolveRound(game, !!correct);

        await gameDao.update(game);

        // send notification for next phase
        this.socket.to(ROOM_GAME(game.id)).emit(GameEvent.Update, game);
        if (game.phase === GamePhase.HintWriting) {
            const audience: string[] = game.players.filter(p => p.id !== game.rounds[game.round].guesserId).map(p => p.id);
            this.socket.to(ROOM_GAME(game.id)).emit(GameEvent.Notification, {
                transKey: 'GAME.MESSAGE.YOUR_TURN_HINT_WRITING',
                audience
            });
        }

        return true;
    };

    async deleteGame(gameId: string) {
        const game = await gameDao.getOne(gameId);

        if (!game) throw new Error(gameNotFoundError);
        if (game.hostId !== this.userId && !getClearedForDeletion(game)) throw new Error(forbiddenError);

        await gameDao.delete(gameId);

        this.socket.to(ROOM_GAME_LIST).emit(GameEvent.UpdateList);

        return true;
    };
}


/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default GameApi;
