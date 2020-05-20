import React from 'react';
import { Typography } from '@material-ui/core';
import { IGame, IHint } from '../../custom.d';
import { WordCard } from '../components/WordCard';
import { WordHint } from '../components/WordHint';

import { SETTING_ID } from '../../shared/constants';
import { getCurrentUserInGame } from '../../shared/functions';
import * as api from '../../shared/apiFunctions';

type GuessingViewProps = {
    game: IGame
};

export class GuessingView extends React.Component<GuessingViewProps> {
    public currentUserId: string = localStorage.getItem(SETTING_ID) || '';

    constructor(props: GuessingViewProps) {
        super(props);

        this.guess = this.guess.bind(this);
    }

    guess(guess: string) {
        api.guess(this.props.game.id, guess);
    }

    render() {
        const game: IGame = this.props.game;
        const currentUser = getCurrentUserInGame(game, this.currentUserId); // TODO
        const guesser = game.currentGuesser ? game.currentGuesser : { name: '?', id: '?' }; // TODO
        const isGuesser = currentUser && currentUser.id === guesser.id;
        const guesserName = isGuesser ? 'Ich' : guesser.name;

        const currentWord = isGuesser ? '?' : (game.currentWord || '');
        const currentHints = game.hints.map((hintObj: IHint, index: number) => {
            let hint: string = hintObj.hint;
            const hintIsMine = currentUser && currentUser.id === hintObj.author.id;
            const authorName = hintIsMine ? 'Ich' : hintObj.author.name;

            if (isGuesser && hintObj.isDuplicate) {
                hint = 'LEIDER DOPPELT';
            } 

            return (
                <WordHint 
                    key={hintObj.author.id+index} 
                    hint={hint} 
                    color={hintObj.author.color}
                    duplicate={hintObj.isDuplicate}
                    author={authorName}
                />
            );
        });

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
                        showInput={isGuesser}
                        submitHint={this.guess}/>
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
