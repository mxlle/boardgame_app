import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { IGame } from '../custom.d';

import { GAME_URL, SETTING_ID } from '../App';

const POLLING_INTERVAL = 2000;

type JustOneHomeProps = {};
type JustOneHomeState = {
  allGames: IGame[]
};

export class JustOneHome extends React.Component<JustOneHomeProps,JustOneHomeState> {
  public currentUserId: string = localStorage.getItem(SETTING_ID) || '';

  private _interval: any; // TODO

  constructor(props: JustOneHomeProps) {
    super(props);

    this.createGame = this.createGame.bind(this);

    this.state = { allGames: [] };
  }

  componentDidMount() {
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
    const gameList = this.state.allGames.map(game => (
      <Link key={game.id} to={`/${game.id}`}>{`Spiele ${game.id}`}</Link>
    ));

    return (
      <div className="Game-list">
        <Button variant="contained" color="primary" onClick={this.createGame}>Neues Spiel</Button>
        {gameList}
      </div>
    );
  }
}

function createGame(): IGame {
    return {"id":"", "name": "", "words":[],"players":[],"host":"1","round":0,"phase":0,"hints":[],"correctWords":[],"wrongWords":[]};
}