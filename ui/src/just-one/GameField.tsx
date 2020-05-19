import React from 'react';
import { Button, Typography } from '@material-ui/core';
import { IGame, IHint, IUser, GamePhase } from '../custom.d';
import { WordCard } from './components/WordCard';
import { WordHint } from './components/WordHint';

import { SETTING_ID } from '../shared/constants';
import * as api from '../shared/apiFunctions';

type GameFieldProps = {
    game: IGame
};

export class GameField extends React.Component<GameFieldProps> {
    public currentUserId: string = localStorage.getItem(SETTING_ID) || '';

    constructor(props: GameFieldProps) {
        super(props);

        this.submitHint = this.submitHint.bind(this);
        this.toggleDuplicate = this.toggleDuplicate.bind(this);
        this.showHints = this.showHints.bind(this);
        this.guess = this.guess.bind(this);
        this.resolveRound = this.resolveRound.bind(this);
    }

    submitHint(hintWord: string) {
        const currentUser = getCurrentUser(this.props.game, this.currentUserId);
        if (!currentUser) return; // TODO
        const hint: IHint = { hint: hintWord, author: currentUser};

        api.submitHint(this.props.game.id, hint);
    }

    toggleDuplicate(hintIndex: number) {
        api.toggleDuplicate(this.props.game.id, hintIndex);
    }

    showHints() {
        api.showHints(this.props.game.id);
    }

    guess(guess: string) {
        api.guess(this.props.game.id, guess);
    }

    resolveRound(correct: boolean = true) {
        api.resolveRound(this.props.game.id, correct);
    }

    render() {
        const game: IGame = this.props.game;
        const currentUser = getCurrentUser(game, this.currentUserId); // TODO
        const guesser = game.currentGuesser ? game.currentGuesser : { name: '?', id: '?' }; // TODO
        const isGuesser = currentUser && currentUser.id === guesser.id;

        const isWritingPhase = game.phase === GamePhase.HintWriting;
        const isComparingPhase = game.phase === GamePhase.HintComparing;
        const isGuessingPhase = game.phase === GamePhase.Guessing;
        const isSolutionPhase = game.phase === GamePhase.Solution;

        const isRoundHost = game.roundHost && this.currentUserId === game.roundHost.id;
        const showDuplicateToggle = isRoundHost && isComparingPhase;

        const currentWord = isGuesser && !isSolutionPhase ? '?' : (game.currentWord || '');
        const currentGuess = game.currentGuess || '';
        const currentHints = game.hints.map((hintObj: IHint, index: number) => {
            let hint: string = hintObj.hint;
            const hintIsMine = currentUser && currentUser.id === hintObj.author.id;
            const showHint = !hint || isGuessingPhase || isSolutionPhase || hintIsMine || (isComparingPhase && !isGuesser);
            const showInput = !hint && isWritingPhase && hintIsMine;

            if (isGuessingPhase && isGuesser && hintObj.isDuplicate) {
                hint = 'LEIDER DOPPELT';
            } 

            const authorName = hintIsMine ? 'Ich' : hintObj.author.name;

            return <WordHint key={hintObj.author.id+index} 
                            hint={hint} 
                            color={hintObj.author.color}
                            showInput={showInput}
                            submitHint={this.submitHint}
                            showCheck={!showHint}
                            duplicate={hintObj.isDuplicate}
                            showDuplicateToggle={showDuplicateToggle}
                            toggleDuplicate={()=>this.toggleDuplicate(index)}
                            author={authorName}/>
        });
        let solutionButton1 = <Button variant="contained" color="primary" onClick={() => this.resolveRound(true)}>Super, weiter geht's</Button>;
        let solutionButton2;
        if (!game.guessedRight) {
            solutionButton1 = <Button variant="contained" onClick={() => this.resolveRound(true)}>Das zählt trotzdem</Button>;
            solutionButton2 = <Button variant="contained" color="primary" onClick={() => this.resolveRound(false)}>Leider falsch</Button>;
        }

        const showGuessInput = isGuessingPhase && isGuesser;
        const guesserName = isGuesser ? 'Ich' : guesser.name;

        return (
            <div className="Game-field">
                <div className="Current-word">
                    <Typography variant="h5">
                        Begriff
                    </Typography>
                    <WordCard 
                        word={currentWord} 
                        guesser={guesserName} 
                        color={guesser.color} 
                        showInput={showGuessInput}
                        submitHint={this.guess}
                        guess={isSolutionPhase ? currentGuess : ''} 
                        guessedRight={game.guessedRight}/>
                    {isSolutionPhase && (isRoundHost || game.guessedRight) && solutionButton1}
                    {isSolutionPhase && isRoundHost && solutionButton2}
                </div>
                <div className="Current-hints">
                    <Typography variant="h5">
                        Spieler-Hinweise
                    </Typography>
                    <div className="WordHint-list">{currentHints}</div>
                    {isComparingPhase && isRoundHost && (
                        <Typography variant="subtitle1">
                            Benutze die Smiley-Buttons auf den Hinweisen um doppelte oder ungültige Werte zu markieren.
                        </Typography>
                    )}
                    {isComparingPhase && isRoundHost && <Button variant="contained" color="primary" onClick={this.showHints}>{guesser.name + ' kann losraten!'}</Button>}
                </div>
            </div>
        );
    }
}

function getCurrentUser(game: IGame, currentUserId: string): IUser|undefined {
    return game.players.find(player => player.id === currentUserId);
}
