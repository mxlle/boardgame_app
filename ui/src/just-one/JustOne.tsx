import React from 'react';
import { Button } from '@material-ui/core';
import logo from './Just_One_Banner.jpg';
import {GameField} from './GameField';
import {GameLobby} from './GameLobby';
import { IGame } from 'boardgame_api/src/entities/Game';

const GAME_ID = '005f2668-707f-4f50-9453-0c2a2dbfc32e';

const API_URL = 'http://localhost:9000/api';
const GAME_URL = API_URL + '/games';

type JustOneProps = {};
type JustOneState = {
  currentGame?: IGame
};

export class JustOne extends React.Component<JustOneProps,JustOneState> {
  allWords = [
    'Ananas',
    'Bauernhof',
    'Clown',
    'Dartscheibe',
    'Elefant',
    'Fussball',
  ];
  private _interval: number = 0;

  constructor(props: JustOneProps) {
    super(props);

    this.createGame = this.createGame.bind(this);

    this.state = {};
  }

  componentDidMount() {
    this.loadGame();

    this._interval = setInterval(this.loadGame.bind(this), 1000);
  }

  componentWillUnmount() {
    clearInterval(this._interval);
  }

  loadGame(id: string = GAME_ID) {
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
        console.log(data);
      })
      .catch(console.log)
  }

  createGame() {
    const game: IGame = createGame();
    game.props.words = this.allWords;
    game.props.players = [{ id: '1', name: 'Almut', color: '#FF0044' }];
    game.props.host = '1';

    fetch(`${GAME_URL}/add`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({game})
    }).then((data) => {
        console.log(data);
        this.loadGames();
      })
      .catch(console.log)
  }

  render() {
    let optionalContent: React.ReactElement;
    if (this.state.currentGame) {
      if (this.state.currentGame.state.phase === 0) { // TODO GamePhase.Init
        optionalContent = <GameLobby game={this.state.currentGame}></GameLobby>
      } else {
        optionalContent = <GameField game={this.state.currentGame}></GameField>;
      }
    } else {
      optionalContent = <Button variant="contained" color="primary" onClick={this.createGame}>Neues Spiel</Button>;
    }

    return (
      <div>
        <img src={logo} className="JustOne-banner" alt="logo" />
        <h1>Spiele jetzt Just One</h1>     
        {optionalContent}
      </div>
    );
  }
}

function createGame(): IGame {
    return {"id":"","props":{"words":[],"players":[],"host":"1"},"state":{"round":0,"phase":0,"hints":[],"correctWords":[],"wrongWords":[]}};
}