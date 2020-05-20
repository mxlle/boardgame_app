import React from 'react';
import { IGame, GamePhase } from '../../custom.d';
import { getUserInGame } from '../../shared/functions';

type GameStatsProps = {
  game: IGame
};

export class GameStats extends React.Component<GameStatsProps> {
  render() {
    const game: IGame = this.props.game;
    const roundHost = getUserInGame(game, game.roundHost) || { name: '?' };
    const guesser = getUserInGame(game, game.currentGuesser) || { name: '?' };

    let gamePhase;
    switch(game.phase) {
      case GamePhase.HintWriting: 
        const players = game.players.filter(p => game.currentGuesser && p.id !== game.currentGuesser).map(p => p.name);
        const playersString = players.slice(0, players.length-1).join(', ') + ' und ' + players[players.length-1];
        gamePhase = playersString + ' schreiben Hinweise auf...';
        break;
      case GamePhase.HintComparing: 
        gamePhase = roundHost.name + ' überprüft die Hinweise auf ungültige oder doppelte Wörter...';
        break;
      case GamePhase.Guessing: 
        gamePhase = guesser.name + ' versucht den Begriff zu erraten...';
        break;
      case GamePhase.Solution: 
        if (game.guessedRight) {
          gamePhase = guesser.name + ' lag genau richtig!';
        } else {
          gamePhase = guesser.name + ' lag daneben! ' + roundHost.name + ' entscheidet ob es trotzdem zählt...';
        }
        break;
    }

    return (
      <div className="Game-progress">
        <div>Runde: {game.round+1}/{game.words.length}, Richtige: {game.correctWords.length}, Falsche: {game.wrongWords.length}</div>
        <div>Phase: {gamePhase}</div>
      </div>
    );
  }
}
