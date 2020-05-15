import React from 'react';
import { IGame } from 'boardgame_api/src/entities/Game';
import { IUser } from 'boardgame_api/src/entities/User';
import { Button } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import {WordHint} from './WordHint';
const ColorPicker = require('material-ui-color-picker');

const API_URL = 'http://localhost:9000/api';
const GAME_URL = API_URL + '/games';

type GameLobbyProps = {
  game: IGame
}
type GameLobbyState = {
  name: string,
  color: string
}

export class GameLobby extends React.Component<GameLobbyProps,GameLobbyState> {

  public state: GameLobbyState = { 
    name: '',
    color: '#000000'
  };

  constructor(props: GameLobbyProps) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleColorChange = this.handleColorChange.bind(this);
    this.addPlayer = this.addPlayer.bind(this);
    this.startGame = this.startGame.bind(this);
  }

  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.name === 'name') {
      this.setState({
        name: event.target.value
      });  
    }
  }

  handleColorChange(color: string) {
    this.setState({
      color: color
    });  
  }

  addPlayer() {
    const player = { name: this.state.name, color: this.state.color };

    fetch(`${GAME_URL}/${this.props.game.id}/addPlayer`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({player})
    }).then((data) => {
        this.setState({
          color: '#000000',
          name: ''
        });
      })
      .catch(console.log)
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

    const currentUser: IUser = this.props.game.players[0]; // TODO

    return (
      <div className="Game-lobby">
        <div className="New-player">
          <TextField required label="Spielername" 
            name='name'
            value={this.state.name} 
            onChange={this.handleChange}  />
          <ColorPicker
            name='color'
            label='Spielerfarbe'
            defaultValue={this.state.color}
            value={this.state.color}
            onChange={this.handleColorChange}
          />
          <Button variant="contained" color="primary" 
            disabled={!this.state.name} 
            onClick={this.addPlayer}>Mitspielen</Button>
          {
            this.props.game.host === currentUser.id && 
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