import React from 'react';
import { IGame, IUser } from '../custom.d';
import { Button } from '@material-ui/core';
import { WordHint } from './WordHint';
import { NewPlayer } from './NewPlayer';

import { GAME_URL } from '../App';

const SETTING_ID = 'playerId';
const SETTING_NAME = 'playerName';
const SETTING_COLOR = 'playerColor';

type GameLobbyProps = {
  game: IGame
}
type GameLobbyState = {
  name: string,
  color: string
}

export class GameLobby extends React.Component<GameLobbyProps,GameLobbyState> {

  public state: GameLobbyState = { 
    name: localStorage.getItem(SETTING_NAME) || '',
    color: localStorage.getItem(SETTING_COLOR) || 'black'
  };

  constructor(props: GameLobbyProps) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.addPlayer = this.addPlayer.bind(this);
    this.startGame = this.startGame.bind(this);
  }

  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.name === 'name') {
      this.setState({
        name: event.target.value
      });  
    } else if (event.target.name === 'color') {
      this.setState({
        color: event.target.value
      });  
    }
  }

  addPlayer(player: IUser) {
    fetch(`${GAME_URL}/${this.props.game.id}/addPlayer`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({player})
    }).then(res => res.json())
      .then((data) => {
        this.setLocalPlayer(data.player);
        this.setState({
          color: 'black',
          name: ''
        });
      })
      .catch(console.log)
  }

  setLocalPlayer(player: IUser) {
    localStorage.setItem('playerId', player.id);
    localStorage.setItem('playerName', player.name);
    if (player.color) localStorage.setItem('playerColor', player.color);
  }

  startGame() {
    fetch(`${GAME_URL}/${this.props.game.id}/start`, {
      method: 'PUT'
    }).then((data) => {
        // TODO
      })
      .catch(console.log)
  }

  render() {
    const listOfPlayers = this.props.game.players.map(player => (
      <WordHint key={player.id} hint={player.name} color={player.color}></WordHint>
    ));

    const currentUserId: string = localStorage.getItem(SETTING_ID) || '';
    const isHost: boolean = !!currentUserId && this.props.game.host === currentUserId;
    const isInGame: boolean = !!currentUserId && this.props.game.players.findIndex(player => player.id === currentUserId) > -1;

    return (
      <div className="Game-lobby">
        <div className="New-player">
          { 
            !isInGame && 
            <NewPlayer name={this.state.name} color={this.state.color}
              addPlayer={this.addPlayer}></NewPlayer>
          }
          {
            isHost && 
            <Button variant="contained" color="primary" 
              disabled={this.props.game.players.length < 3} 
              onClick={this.startGame}>Spiel beginnen</Button>
          }
        </div>
        <div className="Player-list">
          {listOfPlayers}
          <WordHint hint={this.state.name || '?'} color={this.state.color}></WordHint>
        </div>
      </div>
    );
  }

}