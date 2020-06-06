import React from 'react';
import { Container } from '@material-ui/core';
import GameLobby from './GameLobby';
import {GamePreparation} from './GamePreparation';
import GameEndView from './GameEndView';
import GameStats from './components/GameStats';
import HintWritingView from './gamePhases/HintWritingView';
import HintComparingView from './gamePhases/HintComparingView';
import GuessingView from './gamePhases/GuessingView';
import SolutionView from './gamePhases/SolutionView';
import { IGame, GamePhase } from '../types';

import { loadGame } from '../shared/apiFunctions';
import { setDocumentTitle } from '../shared/functions';
import {loadTutorial, TUTORIAL_ID} from "./tutorial";

const POLLING_INTERVAL = 1000;

type JustOneGameProps = {
    gameId: string,
    setTheme?: (color: string)=>void
};
type JustOneGameState = {
    currentGame?: IGame
};

export default class OneWordGame extends React.Component<JustOneGameProps,JustOneGameState> {
    public state: JustOneGameState = {};
    private _interval: number|undefined;
    private _isMounted: boolean = false;

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
        const {setTheme} = this.props;
        const {currentGame} = this.state;

        if (!currentGame) return null;

        let gameContent;
        let gameStats;

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
                break;
        }

        return (
            <Container maxWidth="lg" className="Game-content">
                {gameContent}
                {gameStats}
            </Container>
        );
    }
}
