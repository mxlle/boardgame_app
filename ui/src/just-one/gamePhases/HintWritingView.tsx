import React from 'react';
import { Typography } from '@material-ui/core';
import { IGame, IHint } from '../../custom.d';
import { WordCard } from '../components/WordCard';
import { WordHint } from '../components/WordHint';

import { getCurrentUserInGame, getUserInGame } from '../../shared/functions';
import * as api from '../../shared/apiFunctions';

type HintWritingViewProps = {
    game: IGame
};

export class HintWritingView extends React.Component<HintWritingViewProps> {
    constructor(props: HintWritingViewProps) {
        super(props);

        this.submitHint = this.submitHint.bind(this);
    }

    submitHint(hint: string) {
        api.submitHint(this.props.game.id, hint);
    }

    render() {
        const game: IGame = this.props.game;
        const currentUser = getCurrentUserInGame(game);
        const guesser = getUserInGame(game, game.currentGuesser) || { name: '?', id: '?' };
        const isGuesser = currentUser && currentUser.id === guesser.id;
        const guesserName = isGuesser ? 'Ich' : guesser.name;

        const currentWord = isGuesser ? '?' : (game.currentWord || '');
        const currentHints = game.hints.map((hintObj: IHint, index: number) => {
            const hint: string = hintObj.hint;
            const hintIsMine = currentUser && currentUser.id === hintObj.author;
            const author = getUserInGame(game, hintObj.author) || { name: '?', id: '?' };
            const authorName = hintIsMine ? 'Ich' : author.name;
            const showHint = !hint || hintIsMine;
            const showInput = !hint && hintIsMine;

            return (
                <WordHint 
                    key={hintObj.author+index} 
                    hint={hint} 
                    color={author.color}
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
