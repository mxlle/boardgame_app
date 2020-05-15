import React from 'react';
import { IGame } from '../custom.d';

type GameStatsProps = {
  game: IGame
};

export class GameStats extends React.Component<GameStatsProps> {
  render() {
    const game: IGame = this.props.game;

    return (
      <div className="Game-progress">
        Runde: {game.round+1}/{game.words.length}, Richtige: {game.correctWords.length}, Falsche: {game.wrongWords.length}
      </div>
    );
  }
}
