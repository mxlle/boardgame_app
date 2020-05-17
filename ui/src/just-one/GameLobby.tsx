import React from 'react';
import { IGame, IUser } from '../custom.d';
import { Button } from '@material-ui/core';
import { WordHint } from './WordHint';
import { NewPlayer } from './NewPlayer';
import { WordAdder, DEFAULT_NUM_WORDS  } from './WordAdder';
import { getRandomColor } from '../common/ColorPicker';

import { GAME_URL, SETTING_ID, SETTING_NAME, SETTING_COLOR } from '../App';

type GameLobbyProps = {
  game: IGame,
  setTheme?: (color: string)=>void
}
type GameLobbyState = {
  currentPlayer: IUser
}

export class GameLobby extends React.Component<GameLobbyProps,GameLobbyState> {

  public state: GameLobbyState = { 
    currentPlayer: {
      id: localStorage.getItem(SETTING_ID) || '',
      name: localStorage.getItem(SETTING_NAME) || '',
      color: getRandomColor(localStorage.getItem(SETTING_COLOR))
    }
  };

  constructor(props: GameLobbyProps) {
    super(props);

    this.addPlayer = this.addPlayer.bind(this);
    this.addWords = this.addWords.bind(this);
    this.setPlayerProps = this.setPlayerProps.bind(this);
    this.startGame = this.startGame.bind(this);
  }

  setPlayerProps(player: IUser) {
    this.setState({
      currentPlayer: player
    });
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
      })
      .catch(console.log)
  }

  addWords(words: string[]) {
    let player: IUser = this.state.currentPlayer;
    player.enteredWords = words;

    fetch(`${GAME_URL}/${this.props.game.id}/updatePlayer`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({player})
    }).then(res => res.json())
      .then((data) => {
        this.setLocalPlayer(data.player);
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
    this.setState({
      currentPlayer: player
    });
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
    const { game } = this.props;
    const { currentPlayer } = this.state;
    const numWordsPerPlayer = DEFAULT_NUM_WORDS;
    const currentUserId: string = localStorage.getItem(SETTING_ID) || '';

    let isInGame: boolean = false;
    //let myWords: string[] = [];
    let allMyWordsEntered: boolean = false;
    const listOfPlayers = game.players.map(player => {
      const wordsEntered: boolean = !!player.enteredWords && player.enteredWords.length === numWordsPerPlayer;
      if (player.id === currentUserId) {
        isInGame = true;
        //myWords = player.enteredWords || [];
        allMyWordsEntered = wordsEntered;
      } 
      return (
        <WordHint key={player.id} hint={player.name} color={player.color} showPencil={!wordsEntered}></WordHint>
      )
    });
    const isHost: boolean = !!currentUserId && game.host === currentUserId;
    const allWordsEntered: boolean = game.words.length >= numWordsPerPlayer*listOfPlayers.length;
    const newPlayerName: string = (isInGame || !currentPlayer.name) ? '?' : currentPlayer.name;
    const newPlayerColor: string = (isInGame || !currentPlayer.color) ? getRandomColor() : currentPlayer.color;

    return (
      <div className="Game-lobby">
        <div className="New-player">
          { 
            !isInGame && 
            <NewPlayer name={currentPlayer.name} color={currentPlayer.color || getRandomColor()} 
              updatePlayer={this.setPlayerProps}
              addPlayer={this.addPlayer}/>
          }
          { 
            isInGame && !allMyWordsEntered &&
            <WordAdder add={this.addWords}/>
          }
          {
            isHost && 
            <Button variant="contained" color="primary" 
              disabled={game.players.length < 3 || !allWordsEntered} 
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