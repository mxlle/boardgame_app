import React from 'react';
import {WordCard} from './WordCard';
import { IGame } from '../custom.d';

type GameEndViewProps = {
  game: IGame
};

export class GameEndView extends React.Component<GameEndViewProps> {
  render() {
    const game: IGame = this.props.game;
    const correctWords = game.correctWords.map(wordResult => {
      return <WordCard key={wordResult.word} word={wordResult.word} guess={wordResult.guess} guessedRight={true}/>
    });
    const wrongWords = game.wrongWords.map(wordResult => {
      return <WordCard key={wordResult.word} word={wordResult.word} guess={wordResult.guess} guessedRight={false}/>
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
