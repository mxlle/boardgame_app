import React from 'react';
import { Button } from '@material-ui/core';
import {WordCard} from './WordCard';
import { IGame } from 'boardgame_api/src/entities/Game';
import {WordHint} from './WordHint';
import {WordHintInput} from './WordHintInput';

type GameFieldProps = {
  game: IGame
};
type GameFieldState = {
  currentWord: string, 
  currentHints: string[]
};

export class GameField extends React.Component<GameFieldProps,GameFieldState> {
  allWords = [
    'Ananas',
    'Bauernhof',
    'Clown',
    'Dartscheibe',
    'Elefant',
    'Fussball',
  ];

  constructor(props: GameFieldProps) {
    super(props);

    this.drawWord = this.drawWord.bind(this);
    this.submitHint = this.submitHint.bind(this);

    this.state = { currentWord: '', currentHints: [] };
  }

  componentDidMount() {
    this.drawWord();
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

  render() {
    const currentWord = this.state.currentWord;
    const currentHints = this.state.currentHints.map(hint => 
      <WordHint hint={hint} />
    );

    return (
      <div className="Game-field">
        <div className="Current-word">
          <Button variant="contained" color="primary" onClick={this.drawWord}>Neues Wort</Button>
          <WordCard word={currentWord}/>
        </div>
        <div className="Current-hints">
          <WordHintInput submitHint={this.submitHint}/>
          <div className="WordHint-list">{currentHints}</div>
        </div>
      </div>
    );
  }
}
