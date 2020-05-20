import React from 'react';
import { Button, Typography } from '@material-ui/core';
import { IGame, IHint } from '../../custom.d';
import { WordCard } from '../components/WordCard';
import { WordHint } from '../components/WordHint';

import { SETTING_ID } from '../../shared/constants';
import { getCurrentUserInGame } from '../../shared/functions';
import * as api from '../../shared/apiFunctions';

type SolutionViewProps = {
    game: IGame
};

export class SolutionView extends React.Component<SolutionViewProps> {
    public currentUserId: string = localStorage.getItem(SETTING_ID) || '';

    constructor(props: SolutionViewProps) {
        super(props);

        this.resolveRound = this.resolveRound.bind(this);
    }

    resolveRound(correct: boolean = true) {
        api.resolveRound(this.props.game.id, correct);
    }

    render() {
        const game: IGame = this.props.game;
        const currentUser = getCurrentUserInGame(game, this.currentUserId); // TODO
        const guesser = game.currentGuesser ? game.currentGuesser : { name: '?', id: '?' }; // TODO
        const isGuesser = currentUser && currentUser.id === guesser.id;
        const guesserName = isGuesser ? 'Ich' : guesser.name;
        const isRoundHost = game.roundHost && this.currentUserId === game.roundHost.id;

        const currentWord = game.currentWord || '';
        const currentGuess = game.currentGuess || '';
        const currentHints = game.hints.map((hintObj: IHint, index: number) => {
            const hintIsMine = currentUser && currentUser.id === hintObj.author.id;
            const authorName = hintIsMine ? 'Ich' : hintObj.author.name;

            return (
                <WordHint 
                    key={hintObj.author.id+index} 
                    hint={hintObj.hint} 
                    color={hintObj.author.color}
                    author={authorName}
                />
            );
        });
        let solutionButton1 = <Button variant="contained" color="primary" onClick={() => this.resolveRound(true)}>Super, weiter geht's</Button>;
        let solutionButton2;
        if (!game.guessedRight) {
            solutionButton1 = <Button variant="contained" onClick={() => this.resolveRound(true)}>Das zählt trotzdem</Button>;
            solutionButton2 = <Button variant="contained" color="primary" onClick={() => this.resolveRound(false)}>Leider falsch</Button>;
        }

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
                        guess={currentGuess} 
                        guessedRight={game.guessedRight}/>
                    {(isRoundHost || game.guessedRight) && solutionButton1}
                    {isRoundHost && solutionButton2}
                </div>
                <div className="Current-hints">
                    <Typography variant="h5">
                        Spieler-Hinweise
                    </Typography>
                    <div className="WordHint-list">{currentHints}</div>
                </div>
            </div>
        );
    }
}
