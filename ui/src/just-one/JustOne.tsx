import React from 'react';
import { Button } from '@material-ui/core';
import logo from './Just_One_Banner.jpg';
import {WordCard} from './WordCard';
import {WordHint} from './WordHint';
import {WordHintInput} from './WordHintInput';
import { IGame } from 'boardgame_api/src/entities/Game';

const API_URL = 'http://localhost:9000/api';
const GAME_URL = API_URL + '/games';

type JustOneProps = {};
type JustOneState = {
  currentWord: string, 
  currentHints: string[]
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

  constructor(props: JustOneProps) {
    super(props);
    this.drawWord = this.drawWord.bind(this);
    this.submitHint = this.submitHint.bind(this);
    this.createGame = this.createGame.bind(this);
    this.state = { currentWord: '', currentHints: [] };
  }

  componentDidMount() {
    this.drawWord();

    this.loadGames();
  }

  drawWord() {
    const index = Math.floor(Math.random() * this.allWords.length);
    const drawnWord = this.allWords[index];
    this.setState({ 
      currentWord: drawnWord,
      currentHints: []
    });
  }

  submitHint(hint: string) {
    this.setState((state, props) => ({
      currentHints: state.currentHints.concat([hint])
    }));
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
    game.props.players = [{ id: 1, name: 'Almut', email: 'email' }];

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
    const currentWord = this.state.currentWord;
    const currentHints = this.state.currentHints.map(hint => 
      <WordHint hint={hint} />
    );

    return (
      <div>
        <img src={logo} className="JustOne-banner" alt="logo" />
        <h1>Spiele jetzt Just One</h1>
        <div className="Game-field">
          <div className="Current-word">
            <Button variant="contained" color="primary" onClick={this.createGame}>Neues Spiel</Button>
            <Button variant="contained" color="primary" onClick={this.drawWord}>Neues Wort</Button>
            <WordCard word={currentWord}/>
          </div>
          <div className="Current-hints">
            <WordHintInput submitHint={this.submitHint}/>
            <div className="WordHint-list">{currentHints}</div>
          </div>
        </div>
      </div>
    );
  }
}

function createGame(): IGame {
    return {"id":"","props":{"words":[],"players":[]},"state":{"round":0,"phase":0,"hints":[],"correctWords":[],"wrongWords":[]}};
}