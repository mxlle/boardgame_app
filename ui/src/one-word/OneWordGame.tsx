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
import {GameEvent, GamePhase, IGame, ROOM_GAME, SocketEvent} from '../types';

import api from '../shared/apiFunctions';
import {getCurrentUserInGame, setDocumentTitle} from '../shared/functions';
import {loadTutorial, removeTutorial, TUTORIAL_ID} from "./tutorial";
import {Trans} from "react-i18next";
import {RouteComponentProps, withRouter} from "react-router-dom";
import Confetti from "../common/Confetti";
import {allColors} from "../common/ColorPicker";
import socket, {tutorialEmitter} from "../shared/socket";

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
}&RouteComponentProps&WithStyles<typeof styles>;
type JustOneGameState = {
    currentGame?: IGame,
    triggerConfetti: (colors?: string[])=>void
};

export type OneWordGameChildProps = {
    triggerConfetti?: () => void
}

class OneWordGame extends React.Component<JustOneGameProps,JustOneGameState> {
    public state: JustOneGameState = { triggerConfetti: ()=>{} };
    private _isMounted: boolean = false;
    private _confettiTriggered: boolean = false;

    componentDidMount() {
        this._isMounted = true;

        this.updateGame = this.updateGame.bind(this);
        this.triggerConfetti = this.triggerConfetti.bind(this);
        this._setupConnection = this._setupConnection.bind(this);

        this._setupConnection();
        this._subscribeToGame();
        socket.on(SocketEvent.Reconnect, this._setupConnection);
    }

    componentWillUnmount() {
        this._isMounted = false;
        this._unsubscribeFromGame();
        socket.off(SocketEvent.Reconnect, this._setupConnection);
    }

    private _setupConnection() {
        const gameId = this.props.gameId;
        socket.emit(GameEvent.Subscribe, ROOM_GAME(gameId));
        this.loadGame();
    }

    async loadGame() {
        const gameId = this.props.gameId;
        let game;
        if (gameId === TUTORIAL_ID) {
            game = loadTutorial();
        } else {
            game = await api.loadGame(gameId);
        }
        if (game) this.updateGame(game);
    }

    private _subscribeToGame() {
        const { gameId } = this.props;
        if (gameId === TUTORIAL_ID) {
            tutorialEmitter.on(GameEvent.Update, this.updateGame);
        } else {
            socket.on(GameEvent.Update, this.updateGame);
            socket.on(GameEvent.Confetti, this.triggerConfetti);
        }
    }

    private _unsubscribeFromGame() {
        socket.emit(GameEvent.Unsubscribe, ROOM_GAME(this.props.gameId))
        socket.off(GameEvent.Update, this.updateGame);
        socket.off(GameEvent.Confetti, this.triggerConfetti);
        tutorialEmitter.off(GameEvent.Update, this.updateGame);
    }

    updateGame(game: IGame) {
        if (!this._isMounted) return;
        if (this.props.gameId !== game.id) return;

        setDocumentTitle(game.name);
        this.setState({
            currentGame: game
        });
    }

    triggerConfetti(colors?: string[]) {
        this.state.triggerConfetti(colors);
    }

    render() {
        const {setTheme, history, classes} = this.props;
        const {currentGame} = this.state;

        if (!currentGame) return null;

        let gameContent, gameStats, returnBtn, resetTutorialBtn, confettiBtn;

        const backToList = () => {
            if (currentGame.$isTutorial) removeTutorial();
            history.push('/');
        };

        const triggerConfettiSave = async () => {
            if (!this._confettiTriggered) {
                this._confettiTriggered = true;
                await this.triggerConfetti();
                this._confettiTriggered = false;
            }
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
        }

        switch(currentGame.phase) {
            case GamePhase.Init:
                gameContent = <GameLobby game={currentGame} setTheme={setTheme} />;
                break;
            case GamePhase.Preparation:
                gameContent = <GamePreparation game={currentGame} />;
                break;
            case GamePhase.HintWriting:
                gameContent = <HintWritingView game={currentGame} triggerConfetti={triggerConfettiSave} />;
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
                gameContent = <SolutionView game={currentGame} triggerConfetti={triggerConfettiSave} />;
                gameStats   = <GameStats game={currentGame} />;
                break;
            case GamePhase.End:
                gameContent = <GameEndView game={currentGame} triggerConfetti={triggerConfettiSave} />;
                returnBtn = (
                    <Grid item xs={12} className={classes.button}>
                        <Button variant="outlined" onClick={backToList}>
                            <Trans i18nKey={currentGame.$isTutorial ? 'TUTORIAL.CLOSE' : 'GAME.BACK_HOME'}>Back</Trans>
                        </Button>
                    </Grid>
                );
                confettiBtn = (
                    <Grid item xs={12} className={classes.button}>
                        <Button variant="outlined" onClick={sendConfetti}>
                            <Trans i18nKey="COMMON.CONFETTI">Confetti!</Trans>
                        </Button>
                    </Grid>
                );
                break;
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
                {returnBtn}
                {resetTutorialBtn}
                {confettiBtn}
                {gameStats}
                <Confetti colors={allColors} getTrigger={(triggerConfetti) => this.setState({triggerConfetti})} />
            </Container>
        );
    }
}

export default withRouter(withStyles(styles)(OneWordGame));
