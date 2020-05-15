import React from 'react';
import { Button } from '@material-ui/core';
import {WordCard} from './WordCard';
import { IGame, IHint } from 'boardgame_api/src/entities/Game';
import { IUser } from 'boardgame_api/src/entities/User';
import {WordHint} from './WordHint';
import {WordHintInput} from './WordHintInput';
import {GameStats} from './GameStats';

const API_URL = 'http://localhost:9000/api';
const GAME_URL = API_URL + '/games';

type GameFieldProps = {
  game: IGame
};
type GameFieldState = {

};

export class GameField extends React.Component<GameFieldProps,GameFieldState> {
  constructor(props: GameFieldProps) {
    super(props);

    this.submitHint = this.submitHint.bind(this);
    this.showHints = this.showHints.bind(this);
    this.guess = this.guess.bind(this);

    this.state = {  };
  }

  componentDidMount() {

  }

  submitHint(hintWord: string) {
    const hint: IHint = { hint: hintWord, author: getCurrentUser(this.props.game)};

    fetch(`${GAME_URL}/${this.props.game.id}/hint`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({hint})
    }).catch(console.log)
  }

  showHints() {
    fetch(`${GAME_URL}/${this.props.game.id}/showHints`, {
      method: 'PUT'
    }).catch(console.log)
  }

  guess(guess: string) {
    fetch(`${GAME_URL}/${this.props.game.id}/guess`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({guess})
    }).catch(console.log)
  }

  render() {
    const game: IGame = this.props.game;
    const currentUser = getCurrentUser(game); // TODO
    const guesser = game.currentGuesser ? game.currentGuesser : { name: '?', id: '?' }; // TODO
    const isGuesser = (currentUser.id === guesser.id);

    const isComparingPhase = game.phase === 2 // TODO GamePhase.HintComparing;
    const isGuessingPhase = game.phase === 3; // GamePhase.Guessing;

    const currentWord = isGuesser ? '?' : (game.currentWord || '');
    const currentHints = game.hints.map(hintObj => {
      let hint: string = '?';
      if (isGuessingPhase) {
        hint = isGuesser && hintObj.isDuplicate ? 'LEIDER DOPPELT' : hintObj.hint;
      } else if (isComparingPhase) {
        if (true || !isGuesser) hint = hintObj.hint; // TODO
      } else if (currentUser.id === hintObj.author.id ) {
        hint = hintObj.hint || '...';
      }
      return <WordHint key={hintObj.author.id} hint={hint} color={hintObj.author.color} duplicate={hintObj.isDuplicate} />
    });

    return (
      <div className="Game-field">
        <div className="Current-word">
          <GameStats game={game}></GameStats>
          <WordCard word={currentWord}/>
          {isGuessingPhase && <WordHintInput submitHint={this.guess} label="Rateversuch" buttonText="Jetzt raten"/>}
        </div>
        <div className="Current-hints">
          <WordHintInput submitHint={this.submitHint}/>
          <div className="WordHint-list">{currentHints}</div>
          {isComparingPhase && <Button variant="contained" color="primary" onClick={this.showHints}>{guesser.name + ' kann losraten!'}</Button>}
        </div>
      </div>
    );
  }
}

function getCurrentUser(game: IGame): IUser {
  const emptyHint: IHint|undefined = game.hints.find(h => !h.hint);
  let user: IUser = (emptyHint && emptyHint.author) || game.currentGuesser || game.players[0];
  return user;
}
