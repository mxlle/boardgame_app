import React from 'react';
import { Typography } from '@material-ui/core';
import { IGame, IHint } from '../../custom.d';
import { WordCard } from '../components/WordCard';
import { WordHint } from '../components/WordHint';

import { SETTING_ID } from '../../shared/constants';
import { getCurrentUserInGame } from '../../shared/functions';
import * as api from '../../shared/apiFunctions';

type HintWritingViewProps = {
    game: IGame
};

export class HintWritingView extends React.Component<HintWritingViewProps> {
    public currentUserId: string = localStorage.getItem(SETTING_ID) || '';

    constructor(props: HintWritingViewProps) {
        super(props);

        this.submitHint = this.submitHint.bind(this);
    }

    submitHint(hintWord: string) {
        const currentUser = getCurrentUserInGame(this.props.game, this.currentUserId);
        if (!currentUser) return; // TODO
        const hint: IHint = { hint: hintWord, author: currentUser};

        api.submitHint(this.props.game.id, hint);
    }

    render() {
        const game: IGame = this.props.game;
        const currentUser = getCurrentUserInGame(game, this.currentUserId); // TODO
        const guesser = game.currentGuesser ? game.currentGuesser : { name: '?', id: '?' }; // TODO
        const isGuesser = currentUser && currentUser.id === guesser.id;
        const guesserName = isGuesser ? 'Ich' : guesser.name;

        const currentWord = isGuesser ? '?' : (game.currentWord || '');
        const currentHints = game.hints.map((hintObj: IHint, index: number) => {
            const hint: string = hintObj.hint;
            const hintIsMine = currentUser && currentUser.id === hintObj.author.id;
            const showHint = !hint || hintIsMine;
            const showInput = !hint && hintIsMine;
            const authorName = hintIsMine ? 'Ich' : hintObj.author.name;

            return (
                <WordHint 
                    key={hintObj.author.id+index} 
                    hint={hint} 
                    color={hintObj.author.color}
                    showInput={showInput}
                    submitHint={this.submitHint}
                    showCheck={!showHint}
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
                        color={guesser.color} />
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
