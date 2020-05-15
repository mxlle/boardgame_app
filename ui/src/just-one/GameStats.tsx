import React from 'react';
import { Button } from '@material-ui/core';
import {WordCard} from './WordCard';
import { IGame, IHint } from 'boardgame_api/src/entities/Game';
import { IUser } from 'boardgame_api/src/entities/User';
import {WordHint} from './WordHint';
import {WordHintInput} from './WordHintInput';

const API_URL = 'http://localhost:9000/api';
const GAME_URL = API_URL + '/games';

type GameStatsProps = {
  game: IGame
};

export class GameStats extends React.Component<GameStatsProps> {
  constructor(props: GameStatsProps) {
    super(props);
  }

  render() {
    const game: IGame = this.props.game;

    return (
      <div className="Game-progress">
        Runde: {game.round+1}/{game.words.length}, Richtige: {game.correctWords.length}, Falsche: {game.wrongWords.length}
      </div>
    );
  }
}
