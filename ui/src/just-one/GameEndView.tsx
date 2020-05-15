import React from 'react';
import { Button } from '@material-ui/core';
import {WordCard} from './WordCard';
import { IGame } from 'boardgame_api/src/entities/Game';
const API_URL = 'http://localhost:9000/api';
const GAME_URL = API_URL + '/games';

type GameEndViewProps = {
  game: IGame
};
type GameEndViewState = {

};

export class GameEndView extends React.Component<GameEndViewProps,GameEndViewState> {
  constructor(props: GameEndViewProps) {
    super(props);

    this.state = {  };
  }

  componentDidMount() {

  }

  render() {
    const game: IGame = this.props.game;
    const correctWords = game.correctWords.map(word => {
      return <WordCard key={word} word={word}/>
    });
    const wrongWords = game.wrongWords.map(word => {
      return <WordCard key={word} word={word}/>
    });

    return (
      <div className="Game-end-view">
        <div className="Correct-words">
          <h2>Richtig ({game.correctWords.length})</h2>
          {correctWords}
        </div>
        <div className="Wrong-words">
          <h2>Falsch ({game.wrongWords.length})</h2>
          {wrongWords}
        </div>
      </div>
    );
  }
}
