import React from 'react';
import {GameField} from './GameField';
import {GameLobby} from './GameLobby';
import {GameEndView} from './GameEndView';
import {GameStats} from './components/GameStats';
import { IGame, GamePhase } from '../custom.d';

import { loadGame } from '../shared/apiFunctions';
import { setDocumentTitle } from '../shared/functions';

const POLLING_INTERVAL = 1000;

type JustOneGameProps = {
    gameId: string,
    setTheme?: (color: string)=>void
};
type JustOneGameState = {
    currentGame?: IGame
};

export class JustOneGame extends React.Component<JustOneGameProps,JustOneGameState> {
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
        const game = await loadGame(id);
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
            case GamePhase.Preparation:
                gameContent = <GameLobby game={currentGame} setTheme={setTheme}></GameLobby>;
                break;
            case GamePhase.HintWriting:
            case GamePhase.HintComparing:
            case GamePhase.Guessing:
            case GamePhase.Solution:
                gameStats = <GameStats game={currentGame}></GameStats>;
                gameContent = <GameField game={currentGame}></GameField>;
                break;
            case GamePhase.End:
                gameContent = <GameEndView game={currentGame}></GameEndView>;
                break;
        }

        return (
            <div className="Game-content">
                {gameStats}
                {gameContent}
            </div>
        );
    }
}
