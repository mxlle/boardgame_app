import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import logo from './Just_One_Banner.jpg';
import {GameField} from './GameField';
import {GameLobby} from './GameLobby';
import {GameEndView} from './GameEndView';
import { IGame } from '../custom.d';

import { GAME_URL } from '../App';

const SETTING_ID = 'playerId';

type JustOneProps = {
  gameId?: string;
};
type JustOneState = {
  currentGame?: IGame,
  allGames?: IGame[]
};

export class JustOne extends React.Component<JustOneProps,JustOneState> {
  public currentUserId: string = localStorage.getItem(SETTING_ID) || '';
  allWords = [
    'Ananas',
    'Bauernhof',
    'Clown',
    'Dartscheibe',
    'Elefant',
    'Fussball',
  ];
  private _interval: any; // TODO

  constructor(props: JustOneProps) {
    super(props);

    this.createGame = this.createGame.bind(this);

    this.state = {};
  }

  componentDidMount() {
    if (this.props.gameId) {
      this.loadGame();

      this._interval = setInterval(this.loadGame.bind(this), 1000);
    } else {
      this.loadGames();

      this._interval = setInterval(this.loadGames.bind(this), 1000);
    }
  }

  componentWillUnmount() {
    clearInterval(this._interval);
  }

  loadGame() {
    let id = this.props.gameId;
    if (!id) return;

    console.log(GAME_URL);

    fetch(`${GAME_URL}/${id}`)
      .then(res => res.json())
      .then((data) => {
        this.setState({
          currentGame: data.game
        });
      })
      .catch(console.log)
  }

  loadGames() {
    fetch(`${GAME_URL}/all`)
      .then(res => res.json())
      .then((data) => {
        let games = data.games;
        games = games.filter((game: IGame) => {
          return game.phase === 0 || (this.currentUserId && game.players.findIndex(p => p.id === this.currentUserId) > -1);
        });
        this.setState({
          allGames: games
        });
      })
      .catch(console.log)
  }

  createGame() {
    const game: IGame = createGame();
    game.words = this.allWords;

    fetch(`${GAME_URL}/add`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({game})
    }).then((data) => {
        console.log(data);
      })
      .catch(console.log)
  }

  render() {
    const currentGame: IGame|undefined = this.state.currentGame;

    let optionalContent: React.ReactElement;
    let gameList;
    if (currentGame) {
      if (currentGame.phase === 0) { // TODO GamePhase.Init
        optionalContent = <GameLobby game={currentGame}></GameLobby>
      } else if (currentGame.phase === 4) { // TODO GamePhase.End
        optionalContent = (<div>
          <Button variant="contained" color="primary" onClick={this.createGame}>Neues Spiel</Button>
          <GameEndView game={currentGame}></GameEndView>
        </div>);
      } else {
        optionalContent = <GameField game={currentGame}></GameField>;
      }
    } else {
      if (this.state.allGames) gameList = this.state.allGames.map(game => (
        <Link key={game.id} to={`/${game.id}`}>{`Play ${game.id}`}</Link>
      ));
      optionalContent = <Button variant="contained" color="primary" onClick={this.createGame}>Neues Spiel</Button>;
    }

    return (
      <div>
        <img src={logo} className="JustOne-banner" alt="logo" />
        <h1>Spiele jetzt Just One</h1>   
        {!!currentGame && <Link to="/">Zur Startseite</Link>}
        {optionalContent}
        {gameList}
      </div>
    );
  }
}

function createGame(): IGame {
    return {"id":"", "name": "", "words":[],"players":[],"host":"1","round":0,"phase":0,"hints":[],"correctWords":[],"wrongWords":[]};
}