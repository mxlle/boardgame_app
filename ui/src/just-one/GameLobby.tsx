import React from 'react';
import { IGame, IUser } from '../custom.d';
import { Button } from '@material-ui/core';
import { WordHint } from './WordHint';
import { NewPlayer, generateRandomColor } from './NewPlayer';

import { GAME_URL, SETTING_ID, SETTING_NAME, SETTING_COLOR } from '../App';

type GameLobbyProps = {
  game: IGame,
  setTheme?: (color: string)=>void
}
type GameLobbyState = {
  name: string,
  color: string
}

export class GameLobby extends React.Component<GameLobbyProps,GameLobbyState> {

  public state: GameLobbyState = { 
    name: localStorage.getItem(SETTING_NAME) || '',
    color: localStorage.getItem(SETTING_COLOR) || generateRandomColor() || 'black'
  };

  constructor(props: GameLobbyProps) {
    super(props);

    this.addPlayer = this.addPlayer.bind(this);
    this.setPlayerProps = this.setPlayerProps.bind(this);
    this.startGame = this.startGame.bind(this);
  }

  setPlayerProps(player: IUser) {
    this.setState({
      name: player.name,
      color: player.color || ''
    });
  }

  addPlayer(player: IUser) {
    const currentUserId = localStorage.getItem(SETTING_ID) || '';
    player.id = currentUserId;
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
          color: generateRandomColor() || 'black',
          name: ''
        });
      })
      .catch(console.log)
  }

  setLocalPlayer(player: IUser) {
    localStorage.setItem(SETTING_ID, player.id);
    localStorage.setItem(SETTING_NAME, player.name);
    if (player.color) localStorage.setItem('playerColor', player.color);
    if (this.props.setTheme && player.color) {
      this.props.setTheme(player.color);
    }
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
    const newPlayerName: string = (isInGame || !this.state.name) ? '?' : this.state.name;
    const newPlayerColor: string = (isInGame || !this.state.color) ? generateRandomColor() : this.state.color;

    return (
      <div className="Game-lobby">
        <div className="New-player">
          { 
            !isInGame && 
            <NewPlayer name={this.state.name} color={this.state.color} 
              updatePlayer={this.setPlayerProps}
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
          <WordHint hint={newPlayerName} color={newPlayerColor} showPencil={true}></WordHint>
        </div>
      </div>
    );
  }

}