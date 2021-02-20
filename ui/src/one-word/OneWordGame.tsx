import React from 'react';
import {Box, Button, Container, createStyles, Grid, Theme, withStyles, WithStyles} from '@material-ui/core';
import GameLobby from './GameLobby';
import {GamePreparation} from './GamePreparation';
import GameEndView from './GameEndView';
import GameStats from './components/GameStats';
import HintWritingView from './gamePhases/HintWritingView';
import HintComparingView from './gamePhases/HintComparingView';
import GuessingView from './gamePhases/GuessingView';
import SolutionView from './gamePhases/SolutionView';
import {GameEvent, GamePhase, IGame, IUser, NotificationEventOptions, ROOM_GAME, SocketEvent} from '../types';

import api from '../shared/apiFunctions';
import {getCurrentUserId, getCurrentUserInGame, setDocumentTitle} from '../shared/functions';
import {loadTutorial, removeTutorial, TUTORIAL_ID} from "./tutorial";
import {Trans} from "react-i18next";
import {RouteComponentProps, withRouter} from "react-router-dom";
import Confetti from "../common/Confetti";
import {allColors, getRandomColor} from "../common/ColorPicker";
import socket, {tutorialEmitter} from "../shared/socket";
import {SnackbarKey, withSnackbar, WithSnackbarProps} from "notistack";
import i18n, {getCurrentLanguage} from '../i18n';
import ActionButton from "../common/ActionButton";
import {emptyGame} from "./gameFunctions";
import {SETTING_COLOR, SETTING_ID, SETTING_NAME} from "../shared/constants";
import JoiningRequests from "./components/JoiningRequests";
import {SelectionDialogOption, SelectionDialog} from "../common/SelectionDialog";
import NewPlayer from "../common/NewPlayer";

const DEFAULT_CONFETTI_AMMO = 5;
const CONFETTI_AMMO_RELOADING_TIME = 3000;

const styles = (theme: Theme) => createStyles({
    root: {
        flex: '1 0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    button: {
        margin: theme.spacing(1),
        marginTop: theme.spacing(8),
        '&+$button': {
            marginTop: theme.spacing(1)
        }
    }
});

type JustOneGameProps = {
    gameId: string,
    setTheme?: (color: string)=>void
}&RouteComponentProps&WithStyles<typeof styles>&WithSnackbarProps;
type JustOneGameState = {
    currentGame?: IGame,
    currentPlayer: IUser,
    confettiAmmo: number,
    triggerConfetti: (colors?: string[], amount?: number)=>void,
    joinGameDialogOpen: boolean
};

export type OneWordGameChildProps = {}

class OneWordGame extends React.Component<JustOneGameProps,JustOneGameState> {
    public state: JustOneGameState = {
        currentPlayer: {
            id: localStorage.getItem(SETTING_ID) || '',
            name: localStorage.getItem(SETTING_NAME) || '',
            color: localStorage.getItem(SETTING_COLOR) || ''
        },
        triggerConfetti: ()=>{},
        confettiAmmo: DEFAULT_CONFETTI_AMMO,
        joinGameDialogOpen: false
    };
    private _isMounted: boolean = false;
    private _notificationKeys: SnackbarKey[] = [];

    componentDidMount() {
        this._isMounted = true;

        this.setGameAfterUpdate = this.setGameAfterUpdate.bind(this);
        this.triggerConfetti = this.triggerConfetti.bind(this);
        this.reduceConfettiAmmo = this.reduceConfettiAmmo.bind(this);
        this._setupConnection = this._setupConnection.bind(this);
        this.showNotification = this.showNotification.bind(this);
        this.playAgain = this.playAgain.bind(this);

        this._setupConnection();
        socket.on(SocketEvent.Reconnect, this._setupConnection);
    }

    componentDidUpdate(prevProps: Readonly<JustOneGameProps>, prevState: Readonly<JustOneGameState>, snapshot?: any) {
        if (prevProps.gameId !== this.props.gameId) {
            socket.emit(GameEvent.Unsubscribe, ROOM_GAME(prevProps.gameId))
            this._setupConnection();
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
        this._unsubscribeFromGame();
        socket.off(SocketEvent.Reconnect, this._setupConnection);
    }

    private _setupConnection() {
        this._unsubscribeFromGame();
        const gameId = this.props.gameId;
        socket.emit(GameEvent.Subscribe, ROOM_GAME(gameId), (error: any) => {
            if (error !== null) {
                setTimeout(() => (this._setupConnection()), 1000);
            }
        });
        this.loadGame();
        this._subscribeToGame();
    }

    async loadGame() {
        const gameId = this.props.gameId;
        let game;
        if (gameId === TUTORIAL_ID) {
            game = loadTutorial();
        } else {
            game = await api.loadGame(gameId);
        }
        if (game) {
            this.setGameAfterUpdate(game);
        }
    }

    private _subscribeToGame() {
        const { gameId } = this.props;
        if (gameId === TUTORIAL_ID) {
            tutorialEmitter.on(GameEvent.Update, this.setGameAfterUpdate);
            tutorialEmitter.on(GameEvent.Confetti, this.triggerConfetti);
        } else {
            socket.on(GameEvent.Update, this.setGameAfterUpdate);
            socket.on(GameEvent.Confetti, this.triggerConfetti);
            socket.on(GameEvent.Notification, this.showNotification);
        }
    }

    private _unsubscribeFromGame() {
        socket.emit(GameEvent.Unsubscribe, ROOM_GAME(this.props.gameId))
        socket.off(GameEvent.Update, this.setGameAfterUpdate);
        socket.off(GameEvent.Confetti, this.triggerConfetti);
        socket.off(GameEvent.Notification, this.showNotification);
        tutorialEmitter.off(GameEvent.Update, this.setGameAfterUpdate);
        tutorialEmitter.off(GameEvent.Confetti, this.triggerConfetti);
    }

    setGameAfterUpdate(game: IGame) {
        if (!this._isMounted) return;
        if (this.props.gameId !== game.id) return;

        setDocumentTitle(i18n, game.name);
        this.setState({
            currentGame: game
        });
        if (this._notificationKeys.length) {
            this._notificationKeys.forEach((key) => {
                this.props.closeSnackbar(key);
            })
            this._notificationKeys = [];
        }
    }

    async playAgain() {
        const game = this.state.currentGame;
        if (!game) return;

        if (game.rematchId) {
            this.props.history.push('/'+game.rematchId);
        } else {
            const rematch: IGame = emptyGame();
            rematch.name = game.name + ' - ' + i18n.t('GAME.AGAIN', 'Again!');
            rematch.language = getCurrentLanguage();

            try {
                const rematchId = await api.addGame(rematch, game.id);

                this.props.history.push('/'+rematchId);

            } catch(e) {
                this.props.enqueueSnackbar(<Trans i18nKey="ERROR.CREATE_GAME">Error</Trans>, { variant: 'error' });
            }
        }
    }

    triggerConfetti(colors?: string[]) {
        const game = this.state.currentGame;
        let amount = 1;
        if (game && game.phase === GamePhase.End) {
            amount = game.rounds.filter(r => r.correct || r.countAnyway).length / game.rounds.length;
        }
        this.state.triggerConfetti(colors, amount);
    }

    reduceConfettiAmmo() {
        this.setState((state) => {
            const reducedAmmo = state.confettiAmmo - 1;

            if (reducedAmmo === 0) {
                setTimeout(() => {
                    this.setState({
                        confettiAmmo: DEFAULT_CONFETTI_AMMO
                    })
                }, CONFETTI_AMMO_RELOADING_TIME);
            }

            return {
                confettiAmmo: reducedAmmo
            }
        });
    }

    showNotification(options: NotificationEventOptions) {
        if (!options.audience || options.audience.includes(getCurrentUserId())) {
            const isImportantMessage = options?.audience?.length === 1;
            const notificationKey = this.props.enqueueSnackbar(<Trans i18nKey={options.transKey} tOptions={options.tOptions}>{options.transKey}</Trans> , {
                variant: options.variant,
                onClick: () => {
                    this.props.closeSnackbar(notificationKey)
                },
                persist: isImportantMessage
            });
            if (isImportantMessage) {
                this._notificationKeys.push(notificationKey);
            }
        }
    }

    render() {
        const {setTheme, history, classes} = this.props;
        const {currentGame, currentPlayer, confettiAmmo, joinGameDialogOpen} = this.state;

        if (!currentGame) return null;

        let gameContent, gameStats, returnBtn, resetTutorialBtn, confettiBtn, gameTime, againButton, joiningRequests, joinButton;
        let joiningList: SelectionDialogOption[] = [];
        const currentUser = getCurrentUserInGame(currentGame);

        const backToList = () => {
            if (currentGame.$isTutorial) removeTutorial();
            history.push('/');
        };

        const sendConfetti = () => {
            if (this.state.currentGame?.id === TUTORIAL_ID) {
                this.triggerConfetti();
            } else {
                const color = getCurrentUserInGame(currentGame)?.color;
                const colors = color ? [color] : undefined;
                socket.emit(GameEvent.Confetti, currentGame.id, colors);
                this.triggerConfetti(colors);
            }
            this.reduceConfettiAmmo();
        }


        const requestTakeOver = async (oldPlayerId?: string) => {
            if (oldPlayerId) {
                if (!currentPlayer.id) return;
                if (this.props.setTheme && currentPlayer.color) {
                    this.props.setTheme(currentPlayer.color);
                }
                try {
                    await api.requestJoining(currentGame.id, oldPlayerId, currentPlayer);
                } catch(e) {
                    console.log(e);
                }
            }

            this.setState({
                joinGameDialogOpen: false
            });

        }

        const joinGame = (player: IUser = currentPlayer) => {
            if (player) {
                localStorage.setItem(SETTING_NAME, player.name);
                if (player.color) localStorage.setItem('playerColor', player.color);
            }
            this.setState({
                joinGameDialogOpen: true,
                currentPlayer: player
            });
        }

        switch(currentGame.phase) {
            case GamePhase.Init:
                gameContent = <GameLobby game={currentGame} setTheme={setTheme} />;
                break;
            case GamePhase.Preparation:
                gameContent = <GamePreparation game={currentGame} />;
                break;
            case GamePhase.HintWriting:
                gameContent = <HintWritingView game={currentGame} />;
                gameStats   = <GameStats game={currentGame} />;
                break;
            case GamePhase.HintComparing:
                gameContent = <HintComparingView game={currentGame} />;
                gameStats   = <GameStats game={currentGame} />;
                break;
            case GamePhase.Guessing:
                gameContent = <GuessingView game={currentGame} />;
                gameStats   = <GameStats game={currentGame} />;
                break;
            case GamePhase.Solution:
                gameContent = <SolutionView game={currentGame} />;
                gameStats   = <GameStats game={currentGame} />;
                break;
            case GamePhase.End:
                gameContent = <GameEndView game={currentGame} />;
                againButton = !currentGame.$isTutorial && (
                    <Grid item xs={12} className={classes.button}>
                        <Button variant="contained" color="primary" onClick={() => this.playAgain()}>
                            <Trans i18nKey="GAME.AGAIN">Again!</Trans>
                        </Button>
                    </Grid>
                );
                returnBtn = (
                    <Grid item xs={12} className={classes.button}>
                        <Button variant="outlined" onClick={backToList}>
                            <Trans i18nKey={currentGame.$isTutorial ? 'TUTORIAL.CLOSE' : 'GAME.BACK_HOME'}>Back</Trans>
                        </Button>
                    </Grid>
                );
                confettiBtn = currentUser && (
                    <Grid item xs={12} className={classes.button}>
                        <ActionButton loading={!confettiAmmo}>
                            <Button variant="outlined" onClick={sendConfetti} disabled={!confettiAmmo}>
                                <Trans i18nKey={confettiAmmo ? 'COMMON.CONFETTI' : 'COMMON.RELOAD_CONFETTI'} tOptions={{confettiAmmo}}>Confetti!</Trans>
                            </Button>
                        </ActionButton>
                    </Grid>
                );
                if (currentGame.endTime && currentGame.startTime) {
                    const duration = new Date(currentGame.endTime).getTime() - new Date(currentGame.startTime).getTime();
                    const time = new Date(duration).toISOString().substr(11, 8);
                    gameTime = <Box margin={1} marginTop={8} marginBottom={-4}><Trans i18nKey="GAME.COMMON.TIME" tOptions={{time}}>Time: </Trans></Box>;
                }
                break;
        }

        if ([GamePhase.HintWriting, GamePhase.HintComparing, GamePhase.Guessing, GamePhase.Solution].includes(currentGame.phase)) {
            if (!currentUser) {
                const requestedTakeOver = currentGame.joiningRequests.findIndex(req => req.newPlayer.id === localStorage.getItem(SETTING_ID) && !req.denied && !req.accepted) > -1;
                const currentUserName = localStorage.getItem(SETTING_NAME) || '';
                let newPlayer: IUser = {
                    color: getRandomColor(localStorage.getItem(SETTING_COLOR), currentGame.players.map(p => p.color)),
                    ...currentPlayer
                };

                joiningList = currentGame.players.map(p => ({ val: p.id, displayVal: i18n.t('GAME.JOINING.REQUEST_TAKEOVER', { playerName: p.name })}));
                if (currentGame.players.length > 3) {
                    joiningList.unshift({
                        val: getCurrentUserId(),
                        displayVal: i18n.t('GAME.JOINING.NEW_PLAYER')
                    })
                }

                joinButton = !!currentUserName ? (
                    <Grid item xs={12} className={classes.button}>
                        <Button variant="outlined" onClick={() => joinGame()} disabled={requestedTakeOver}>
                            <Trans i18nKey={requestedTakeOver ? 'GAME.JOINING.REQUESTED_JOIN' : 'GAME.LOBBY.JOIN'}>Join</Trans>
                        </Button>
                    </Grid>
                ) : (
                    <Grid item xs={12} className={classes.button}>
                        <NewPlayer currentPlayer={newPlayer}
                                   addPlayer={(player) => joinGame(player)}
                                   updatePlayer={(player) => { this.setState({ currentPlayer: player })}}/>
                    </Grid>
                );
            } else if (currentGame.joiningRequests.length) {
                const filteredTakeOverRequests = currentGame.joiningRequests.filter(req => [currentGame.hostId, req.oldPlayerId].includes(currentUser.id));
                const onRequestAccept = (id: string) => {
                    api.handleJoining(currentGame.id, id);
                };
                const onRequestDeny = (id: string) => {
                    api.handleJoining(currentGame.id, id, true);
                };
                joiningRequests = filteredTakeOverRequests.length > 0 && (
                    <JoiningRequests takeOverRequests={filteredTakeOverRequests} onAccept={onRequestAccept} onDeny={onRequestDeny}/>
                );
            }
        }

        if (currentGame.$isTutorial) {
            const resetTutorial = () => { removeTutorial(); this.loadGame(); };
            resetTutorialBtn = (
                <Grid item xs={12} className={classes.button}>
                    <Button variant="outlined" onClick={resetTutorial}><Trans i18nKey="TUTORIAL.RESTART">Restart tutorial</Trans></Button>
                </Grid>
            );
        }

        return (
            <Container maxWidth="lg" className={classes.root}>
                {gameContent}
                {joiningRequests}
                {joinButton}
                {gameTime}
                {againButton}
                {returnBtn}
                {resetTutorialBtn}
                {confettiBtn}
                {gameStats}
                {!currentUser && <SelectionDialog
                    tKey="GAME.LOBBY.JOIN"
                    open={joinGameDialogOpen}
                    onClose={(playerId: string) => { requestTakeOver(playerId); }}
                    selectedValue={''}
                    possibleValues={joiningList}
                />}
                <Confetti colors={allColors} getTrigger={(triggerConfetti) => this.setState({triggerConfetti})} />
            </Container>
        );
    }
}

export default withSnackbar(withRouter(withStyles(styles)(OneWordGame)));
