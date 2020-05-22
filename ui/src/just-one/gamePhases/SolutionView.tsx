import React from 'react';
import { Trans } from 'react-i18next';
import i18n from '../../i18n';
import { Button, Typography } from '@material-ui/core';
import { IGame, IHint } from '../../custom.d';
import { WordCard } from '../components/WordCard';
import { WordHint } from '../components/WordHint';

import { getCurrentUserInGame, getUserInGame } from '../../shared/functions';
import * as api from '../../shared/apiFunctions';

type SolutionViewProps = {
    game: IGame
};

export class SolutionView extends React.Component<SolutionViewProps> {
    constructor(props: SolutionViewProps) {
        super(props);

        this.resolveRound = this.resolveRound.bind(this);
    }

    resolveRound(correct: boolean = true) {
        api.resolveRound(this.props.game.id, correct);
    }

    render() {
        const game: IGame = this.props.game;
        const currentUser = getCurrentUserInGame(game);
        const guesser = getUserInGame(game, game.currentGuesser) ||  { name: '?', id: '?' };
        const isGuesser = currentUser && currentUser.id === guesser.id;
        const isRoundHost = currentUser && currentUser.id === game.roundHost;

        const currentWord = game.currentWord || '';
        const currentGuess = game.currentGuess || '';
        const currentHints = game.hints.map((hintObj: IHint, index: number) => {
            const hintIsMine = currentUser && currentUser.id === hintObj.author;
            const author = getUserInGame(game, hintObj.author) || { name: '?', id: '?' };
            const authorName = hintIsMine ? i18n.t('COMMON.ME', 'Ich') : author.name;

            return (
                <WordHint 
                    key={hintObj.author+index} 
                    hint={hintObj.hint} 
                    color={author.color}
                    author={authorName}
                />
            );
        });
        let solutionButton1 = (
            <Button variant="contained" color="primary" onClick={() => this.resolveRound(true)}>
                <Trans i18nKey="GAME.SOLUTION.CONTINUE">Weiter</Trans>
            </Button>
        );
        let solutionButton2;
        if (!game.guessedRight) {
            solutionButton1 = (
                <Button variant="contained" onClick={() => this.resolveRound(true)}>
                    <Trans i18nKey="GAME.SOLUTION.CONTINUE_RIGHT">Das zählt trotzdem</Trans>
                </Button>
            );
            solutionButton2 = (
                <Button variant="contained" color="primary" onClick={() => this.resolveRound(false)}>
                    <Trans i18nKey="GAME.SOLUTION.CONTINUE_WRONG">Leider falsch</Trans>
                </Button>
            );
        }

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
                        color={guesser.color} 
                        guess={currentGuess} 
                        guessedRight={game.guessedRight}/>
                    {(isRoundHost || game.guessedRight) && solutionButton1}
                    {isRoundHost && solutionButton2}
                </div>
                <div className="Current-hints">
                    <Typography variant="h5">
                        <Trans i18nKey="GAME.COMMON.PLAYER_HINTS">Spieler-Hinweise</Trans>
                    </Typography>
                    <div className="WordHint-list">{currentHints}</div>
                </div>
            </div>
        );
    }
}
