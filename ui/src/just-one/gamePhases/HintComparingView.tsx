import React from 'react';
import { Button, Typography } from '@material-ui/core';
import { IGame, IHint } from '../../custom.d';
import { WordCard } from '../components/WordCard';
import { WordHint } from '../components/WordHint';

import { SETTING_ID } from '../../shared/constants';
import { getCurrentUserInGame } from '../../shared/functions';
import * as api from '../../shared/apiFunctions';

type HintComparingViewProps = {
    game: IGame
};

export class HintComparingView extends React.Component<HintComparingViewProps> {
    public currentUserId: string = localStorage.getItem(SETTING_ID) || '';

    constructor(props: HintComparingViewProps) {
        super(props);

        this.toggleDuplicate = this.toggleDuplicate.bind(this);
        this.showHints = this.showHints.bind(this);
    }

    toggleDuplicate(hintIndex: number) {
        api.toggleDuplicate(this.props.game.id, hintIndex);
    }

    showHints() {
        api.showHints(this.props.game.id);
    }

    render() {
        const game: IGame = this.props.game;
        const currentUser = getCurrentUserInGame(game, this.currentUserId); // TODO
        const guesser = game.currentGuesser ? game.currentGuesser : { name: '?', id: '?' }; // TODO
        const isGuesser = currentUser && currentUser.id === guesser.id;
        const guesserName = isGuesser ? 'Ich' : guesser.name;
        const isRoundHost = game.roundHost && this.currentUserId === game.roundHost.id;

        const currentWord = isGuesser ? '?' : (game.currentWord || '');
        const currentHints = game.hints.map((hintObj: IHint, index: number) => {
            let hint: string = hintObj.hint;
            const hintIsMine = currentUser && currentUser.id === hintObj.author.id;
            const authorName = hintIsMine ? 'Ich' : hintObj.author.name;

            return (
                <WordHint 
                    key={hintObj.author.id+index} 
                    hint={hint} 
                    color={hintObj.author.color}
                    showCheck={isGuesser}
                    duplicate={hintObj.isDuplicate}
                    showDuplicateToggle={isRoundHost}
                    toggleDuplicate={()=>this.toggleDuplicate(index)}
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
                    { isRoundHost && (
                        <Typography variant="subtitle1">
                            Benutze die Smiley-Buttons auf den Hinweisen um doppelte oder ungültige Werte zu markieren.
                        </Typography>
                    )}
                    {isRoundHost && <Button variant="contained" color="primary" onClick={this.showHints}>{guesser.name + ' kann losraten!'}</Button>}
                </div>
            </div>
        );
    }
}
