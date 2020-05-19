import React from 'react';
import { Button, TextField } from '@material-ui/core';
import { IGame, GamePhase } from '../custom.d';
import { GameList } from './GameList';

import { GAME_URL, SETTING_ID, SETTING_NAME, APP_TITLE, DEFAULT_NUM_WORDS } from '../App';

const POLLING_INTERVAL = 2000;

type JustOneHomeProps = {};
type JustOneHomeState = {
  newGameName: string,
  allGames: IGame[]
};

export class JustOneHome extends React.Component<JustOneHomeProps,JustOneHomeState> {
  public currentUserId: string = localStorage.getItem(SETTING_ID) || '';
  public currentUserName: string = localStorage.getItem(SETTING_NAME) || '';

  private _interval: any; // TODO

  constructor(props: JustOneHomeProps) {
    super(props);

    this.createGame = this.createGame.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.deleteGame = this.deleteGame.bind(this);

    let newGameName = this.currentUserName ? `${this.currentUserName}s Spiel` : 'Neues Spiel';

    this.state = { allGames: [], newGameName: newGameName };
  }

  componentDidMount() {
    document.title = APP_TITLE;

    this.loadGames();

    this._interval = setInterval(this.loadGames.bind(this), POLLING_INTERVAL);
  }

  componentWillUnmount() {
    clearInterval(this._interval);
  }

  loadGames() {
    fetch(`${GAME_URL}/all`)
      .then(res => res.json())
      .then((data) => {
        let games = data.games || [];
        games = games.filter((game: IGame) => {
          return game.phase === GamePhase.Init || (this.currentUserId && game.players.findIndex(p => p.id === this.currentUserId) > -1);
        });
        this.setState({
          allGames: games
        });
      })
      .catch(console.log)
  }

  deleteGame(gameId: string) {
    fetch(`${GAME_URL}/delete/${gameId}`, {
      method: 'DELETE'
    }).then(res => res.json())
      .then((data) => {
        console.log('deleted', data);
      })
      .catch(console.log)
  }

  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({newGameName: event.target.value});
  }

  createGame() {
    const game: IGame = createGame();
    game.name = this.state.newGameName;

    fetch(`${GAME_URL}/add`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({game})
    }).then(res => res.json())
      .then((data) => {
        window.location.href = '/' + data.id;
      })
      .catch(console.log)
  }

  render() {
    const {newGameName, allGames} = this.state;

    return (
      <div className="JustOneHome">
        <TextField label={'Spielname'}
            value={newGameName} 
            onChange={this.handleChange} />
        <Button variant="contained" color="primary" onClick={this.createGame}>Neues Spiel</Button>
        <GameList allGames={allGames} deleteGame={this.deleteGame}/>
      </div>
    );
  }
}

function createGame(): IGame {
    return {"id":"", "name": "", "words":[],"players":[],"host":"1","wordsPerPlayer":DEFAULT_NUM_WORDS,"round":0,"phase":0,"hints":[],"correctWords":[],"wrongWords":[]};
}