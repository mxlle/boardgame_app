import React from 'react';
import {GameField} from './GameField';
import {GameLobby} from './GameLobby';
import {GameEndView} from './GameEndView';
import {GameStats} from './GameStats';
import { IGame, GamePhase } from '../custom.d';

import { GAME_URL, SETTING_ID, APP_TITLE } from '../App';

const POLLING_INTERVAL = 2000;

type JustOneGameProps = {
  gameId: string,
  setTheme?: (color: string)=>void
};
type JustOneGameState = {
  currentGame?: IGame
};

export class JustOneGame extends React.Component<JustOneGameProps,JustOneGameState> {
  public currentUserId: string = localStorage.getItem(SETTING_ID) || '';

  private _interval: any; // TODO

  constructor(props: JustOneGameProps) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    this.loadGame();

    this._interval = setInterval(this.loadGame.bind(this), POLLING_INTERVAL);
  }

  componentWillUnmount() {
    clearInterval(this._interval);
  }

  loadGame() {
    let id = this.props.gameId;
    if (!id) return;

    fetch(`${GAME_URL}/${id}`)
      .then(res => res.json())
      .then((data) => {
        setDocumentTitle(data.game.name);
        this.setState({
          currentGame: data.game
        });
      })
      .catch(console.log)
  }

  render() {
    const currentGame: IGame|undefined = this.state.currentGame;

    let gameContent;
    let gameStats;
    if (currentGame) {
      if ([GamePhase.Init,GamePhase.Preparation].includes(currentGame.phase)) {
        gameContent = <GameLobby game={currentGame} setTheme={this.props.setTheme}></GameLobby>
      } else if (currentGame.phase === GamePhase.End) {
        gameContent = <GameEndView game={currentGame}></GameEndView>;
      } else {
        gameStats = <GameStats game={currentGame}></GameStats>;
        gameContent = <GameField game={currentGame}></GameField>;
      }     
    }

    return (
      <div className="Game-content">
        {gameStats}
        {gameContent}
      </div>
    );
  }
}

function setDocumentTitle(gameName?: string) {
  if (gameName) {
    document.title = `${APP_TITLE} - ${gameName}`;
  } else {
    document.title = APP_TITLE;
  }
}
