import React from 'react';
import {WordCard} from './WordCard';
import { IGame } from '../custom.d';

type GameEndViewProps = {
  game: IGame
};

export class GameEndView extends React.Component<GameEndViewProps> {
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
