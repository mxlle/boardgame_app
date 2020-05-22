import React from 'react';
import { Trans } from 'react-i18next';
import i18n from '../../i18n';
import { Button, Typography } from '@material-ui/core';
import { IGame, IHint } from '../../custom.d';
import { WordCard } from '../components/WordCard';
import { WordHint } from '../components/WordHint';

import { getCurrentUserInGame, getUserInGame } from '../../shared/functions';
import * as api from '../../shared/apiFunctions';

type HintComparingViewProps = {
    game: IGame
};

export class HintComparingView extends React.Component<HintComparingViewProps> {
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
        const currentUser = getCurrentUserInGame(game);
        const guesser = getUserInGame(game, game.currentGuesser) || { name: '?', id: '?' };
        const isGuesser = currentUser && currentUser.id === guesser.id;
        const guesserName = guesser.name;
        const isRoundHost = currentUser && currentUser.id === game.roundHost;

        const currentWord = isGuesser ? '?' : (game.currentWord || '');
        const currentHints = game.hints.map((hintObj: IHint, index: number) => {
            const hintIsMine = currentUser && currentUser.id === hintObj.author;
            const author = getUserInGame(game, hintObj.author) || { name: '?', id: '?' };
            const authorName = hintIsMine ? i18n.t('COMMON.ME', 'Ich') : author.name;

            return (
                <WordHint 
                    key={hintObj.author+index} 
                    hint={hintObj.hint} 
                    color={author.color}
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
                        <Trans i18nKey="GAME.COMMON.WORD">Begriff</Trans>
                    </Typography>
                    <WordCard 
                        word={currentWord} 
                        guesser={guesser.name} 
                        isGuesser={isGuesser}
                        color={guesser.color} />
                </div>
                <div className="Current-hints">
                    <Typography variant="h5">
                        <Trans i18nKey="GAME.COMMON.PLAYER_HINTS">Spieler-Hinweise</Trans>
                    </Typography>
                    <div className="WordHint-list">{currentHints}</div>
                    { isRoundHost && (
                        <Typography variant="subtitle1">
                            <Trans i18nKey="GAME.COMPARING.INFO">Markiere ungültige Hinweise</Trans>
                        </Typography>
                    )}
                    {isRoundHost && (
                        <Button variant="contained" color="primary" onClick={this.showHints}>
                            <Trans i18nKey="GAME.COMPARING.BUTTON">{{guesserName}} kann losraten!</Trans>
                        </Button>
                    )}
                </div>
            </div>
        );
    }
}
