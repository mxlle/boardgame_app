import React from 'react';
import {Button, Container, createStyles, Grid, Theme, withStyles, WithStyles} from '@material-ui/core';
import GameLobby from './GameLobby';
import {GamePreparation} from './GamePreparation';
import GameEndView from './GameEndView';
import GameStats from './components/GameStats';
import HintWritingView from './gamePhases/HintWritingView';
import HintComparingView from './gamePhases/HintComparingView';
import GuessingView from './gamePhases/GuessingView';
import SolutionView from './gamePhases/SolutionView';
import {GameEvent, GamePhase, IGame, NotificationEventOptions, ROOM_GAME, SocketEvent} from '../types';

import api from '../shared/apiFunctions';
import {getCurrentUserId, setDocumentTitle} from '../shared/functions';
import {loadTutorial, removeTutorial, TUTORIAL_ID} from "./tutorial";
import {Trans} from "react-i18next";
import Confetti from "../common/Confetti";
import {allColors} from "../common/ColorPicker";
import socket, {tutorialEmitter} from "../shared/socket";
import {SnackbarKey, withSnackbar, WithSnackbarProps} from "notistack";
import i18n from '../i18n';
import JoiningLater from "./components/JoiningLater";

const styles = (theme: Theme) => createStyles({
    root: {
        flex: '1 0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    button: {
        margin: theme.spacing(1),
        marginTop: theme.spacing(4),
    }
});

type OneWordGameProps = {
    gameId: string,
    setTheme?: (color: string)=>void
}&WithStyles<typeof styles>&WithSnackbarProps;
type OneWordGameState = {
    currentGame?: IGame,
    triggerConfetti: (colors?: string[], amount?: number)=>void,
};

export type OneWordGameChildProps = {}

class OneWordGame extends React.Component<OneWordGameProps,OneWordGameState> {
    public state: OneWordGameState = {
        triggerConfetti: ()=>{},
    };
    private _isMounted: boolean = false;
    private _notificationKeys: SnackbarKey[] = [];

    componentDidMount() {
        this._isMounted = true;

        this.setGameAfterUpdate = this.setGameAfterUpdate.bind(this);
        this.triggerConfetti = this.triggerConfetti.bind(this);
        this._setupConnection = this._setupConnection.bind(this);
        this.showNotification = this.showNotification.bind(this);

        this._setupConnection();
        socket.on(SocketEvent.Reconnect, this._setupConnection);
    }

    componentDidUpdate(prevProps: Readonly<OneWordGameProps>, prevState: Readonly<OneWordGameState>, snapshot?: any) {
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

    triggerConfetti(colors?: string[]) {
        const game = this.state.currentGame;
        let amount = 1;
        if (game && game.phase === GamePhase.End) {
            amount = game.rounds.filter(r => r.correct || r.countAnyway).length / game.rounds.length;
        }
        this.state.triggerConfetti(colors, amount);
    }

    showNotification(options: NotificationEventOptions) {
        if (!options.audience || options.audience.includes(getCurrentUserId())) {
            const isImportantMessage = options?.audience?.length === 1;
            const notificationKey = this.props.enqueueSnackbar(<Trans i18nKey={options.transKey} tOptions={options.tOptions}>{options.transKey}</Trans> , {
                variant: options.variant,
                onClick: () => {
                    this.props.closeSnackbar(notificationKey)
                },
                preventDuplicate: true,
                persist: isImportantMessage
            });
            if (isImportantMessage) {
                this._notificationKeys.push(notificationKey);
            }
        }
    }

    render() {
        const {setTheme, classes} = this.props;
        const {currentGame} = this.state;

        if (!currentGame) return null;
        
        const getGameContent = () => {
            switch(currentGame.phase) {
                case GamePhase.Init:
                    return <GameLobby game={currentGame} setTheme={setTheme} />;
                case GamePhase.Preparation:
                    return <GamePreparation game={currentGame} />;
                case GamePhase.HintWriting:
                    return <HintWritingView game={currentGame} />;
                case GamePhase.HintComparing:
                    return <HintComparingView game={currentGame} />;
                case GamePhase.Guessing:
                    return <GuessingView game={currentGame} />;
                case GamePhase.Solution:
                    return <SolutionView game={currentGame} />;
                case GamePhase.End:
                    return <GameEndView game={currentGame} triggerConfetti={this.triggerConfetti} />;
            }
        }

        const resetTutorial = () => { removeTutorial(); this.loadGame(); };

        return (
            <Container maxWidth="lg" className={classes.root}>
                {getGameContent()}
                <JoiningLater game={currentGame} setTheme={setTheme}/>
                {currentGame.$isTutorial && (
                    <Grid item xs={12} className={classes.button}>
                        <Button variant="outlined" onClick={resetTutorial}><Trans i18nKey="TUTORIAL.RESTART">Restart tutorial</Trans></Button>
                    </Grid>
                )}
                <GameStats game={currentGame} />
                <Confetti colors={allColors} getTrigger={(triggerConfetti) => this.setState({triggerConfetti})} />
            </Container>
        );
    }
}

export default withSnackbar(withStyles(styles)(OneWordGame));
