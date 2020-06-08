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
import {GamePhase, IGame} from '../types';

import {loadGame} from '../shared/apiFunctions';
import {setDocumentTitle} from '../shared/functions';
import {loadTutorial, removeTutorial, TUTORIAL_ID} from "./tutorial";
import {Trans} from "react-i18next";
import {RouteComponentProps, withRouter} from "react-router-dom";
import Confetti from "../common/Confetti";
import {allColors} from "../common/ColorPicker";

const POLLING_INTERVAL = 1000;

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
    triggerConfetti: ()=>void
};

export type OneWordGameChildProps = {
    triggerReload: () => void,
    triggerConfetti?: () => void
}

class OneWordGame extends React.Component<JustOneGameProps,JustOneGameState> {
    public state: JustOneGameState = { triggerConfetti: ()=>{} };
    private _interval: number|undefined;
    private _isMounted: boolean = false;
    private _confettiTriggered: boolean = false;

    componentDidMount() {
        this._isMounted = true;

        this.loadGame();

        this._interval = window.setInterval(this.loadGame.bind(this), POLLING_INTERVAL);
    }

    componentWillUnmount() {
        this._isMounted = false;
        clearInterval(this._interval);
    }

    async loadGame() {
        const id = this.props.gameId;
        let game;
        if (id === TUTORIAL_ID) {
            game = loadTutorial();
        } else {
            game = await loadGame(id);
        }
        if (!this._isMounted) return;
        if (!game) return;
        setDocumentTitle(game.name);
        this.setState({
            currentGame: game
        });
    }

    render() {
        const {setTheme, history, classes} = this.props;
        const {currentGame, triggerConfetti} = this.state;

        if (!currentGame) return null;

        let gameContent, gameStats, returnBtn, resetTutorialBtn, confettiBtn;

        const triggerReload = () => this.loadGame();

        const backToList = () => {
            if (currentGame.$isTutorial) removeTutorial();
            history.push('/');
        };

        const triggerConfettiSave = async () => {
            if (!this._confettiTriggered) {
                this._confettiTriggered = true;
                await triggerConfetti();
                this._confettiTriggered = false;
            }
        };

        switch(currentGame.phase) {
            case GamePhase.Init:
                gameContent = <GameLobby game={currentGame} triggerReload={triggerReload} setTheme={setTheme} />;
                break;
            case GamePhase.Preparation:
                gameContent = <GamePreparation game={currentGame} triggerReload={triggerReload} />;
                break;
            case GamePhase.HintWriting:
                gameContent = <HintWritingView game={currentGame} triggerReload={triggerReload} triggerConfetti={triggerConfettiSave} />;
                gameStats   = <GameStats game={currentGame} />;
                break;
            case GamePhase.HintComparing:
                gameContent = <HintComparingView game={currentGame} triggerReload={triggerReload} />;
                gameStats   = <GameStats game={currentGame} />;
                break;
            case GamePhase.Guessing:
                gameContent = <GuessingView game={currentGame} triggerReload={triggerReload} />;
                gameStats   = <GameStats game={currentGame} />;
                break;
            case GamePhase.Solution:
                gameContent = <SolutionView game={currentGame} triggerReload={triggerReload} triggerConfetti={triggerConfettiSave} />;
                gameStats   = <GameStats game={currentGame} />;
                break;
            case GamePhase.End:
                gameContent = <GameEndView game={currentGame} triggerReload={triggerReload} triggerConfetti={triggerConfettiSave} />;
                returnBtn = (
                    <Grid item xs={12} className={classes.button}>
                        <Button variant="outlined" onClick={backToList}>
                            <Trans i18nKey={currentGame.$isTutorial ? 'TUTORIAL.CLOSE' : 'GAME.BACK_HOME'}>Back</Trans>
                        </Button>
                    </Grid>
                );
                confettiBtn = (
                    <Grid item xs={12} className={classes.button}>
                        <Button variant="outlined" onClick={triggerConfetti}>
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