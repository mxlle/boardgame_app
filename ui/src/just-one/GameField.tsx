import React from 'react';
import { Button } from '@material-ui/core';
import {WordCard} from './WordCard';
import { IGame, IHint, IUser } from '../custom.d';
import {WordHint} from './WordHint';
import {WordHintInput} from './WordHintInput';
import {GameStats} from './GameStats';

import { GAME_URL } from '../App';

const SETTING_ID = 'playerId';

type GameFieldProps = {
  game: IGame
};
type GameFieldState = {

};

export class GameField extends React.Component<GameFieldProps,GameFieldState> {
  public currentUserId: string = localStorage.getItem(SETTING_ID) || '';

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
    const currentUser = getCurrentUser(this.props.game, this.currentUserId);
    if (!currentUser) return; // TODO
    const hint: IHint = { hint: hintWord, author: currentUser};

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
    const currentUser = getCurrentUser(game, this.currentUserId); // TODO
    const guesser = game.currentGuesser ? game.currentGuesser : { name: '?', id: '?' }; // TODO
    const isGuesser = currentUser && currentUser.id === guesser.id;

    const isComparingPhase = game.phase === 2 // TODO GamePhase.HintComparing;
    const isGuessingPhase = game.phase === 3; // GamePhase.Guessing;

    const currentWord = isGuesser ? '?' : (game.currentWord || '');
    const currentHints = game.hints.map(hintObj => {
      let hint: string = '?';
      if (isGuessingPhase) {
        hint = isGuesser && hintObj.isDuplicate ? 'LEIDER DOPPELT' : hintObj.hint;
      } else if (isComparingPhase) {
        if (!isGuesser) hint = hintObj.hint;
      } else if (currentUser && currentUser.id === hintObj.author.id ) {
        hint = hintObj.hint;
      } else if (!hintObj.hint) {
        hint = ''; // TODO
      }
      return <WordHint key={hintObj.author.id} hint={hint} color={hintObj.author.color} duplicate={hintObj.isDuplicate} author={hintObj.author.name}/>
    });

    return (
      <div className="Game-field">
        <div className="Current-word">
          <GameStats game={game}></GameStats>
          <WordCard word={currentWord} guesser={guesser.name} color={guesser.color}/>
          {isGuessingPhase && isGuesser && <WordHintInput submitHint={this.guess} label="Rateversuch" buttonText="Jetzt raten"/>}
        </div>
        <div className="Current-hints">
          {!isGuesser && <WordHintInput submitHint={this.submitHint}/>}
          <div className="WordHint-list">{currentHints}</div>
          {isComparingPhase && !isGuesser && <Button variant="contained" color="primary" onClick={this.showHints}>{guesser.name + ' kann losraten!'}</Button>}
        </div>
      </div>
    );
  }
}

function getCurrentUser(game: IGame, currentUserId: string): IUser|undefined {
  return game.players.find(player => player.id === currentUserId);
}
