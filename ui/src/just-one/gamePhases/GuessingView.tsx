import React from 'react';
import { Trans } from 'react-i18next';
import i18n from '../../i18n';
import { Grid, Typography } from '@material-ui/core';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import { IGame, IHint } from '../../custom.d';
import { WordCard } from '../components/WordCard';
import { WordHint } from '../components/WordHint';

import { getCurrentUserInGame, getUserInGame } from '../../shared/functions';
import * as api from '../../shared/apiFunctions';

type GuessingViewProps = {
    game: IGame
}&WithSnackbarProps;

type GuessingViewState = {
    shownMessage: boolean
};

class GuessingView extends React.Component<GuessingViewProps,GuessingViewState> {
    public state: GuessingViewState = { shownMessage: false };
    private _isMounted: boolean = false;

    constructor(props: GuessingViewProps) {
        super(props);

        this.guess = this.guess.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    guess(guess: string) {
        api.guess(this.props.game.id, guess);
    }

    render() {
        const game: IGame = this.props.game;
        const { shownMessage } = this.state;
        const currentUser = getCurrentUserInGame(game);
        const guesser = getUserInGame(game, game.currentGuesser) || { name: '?', id: '?' };
        const isGuesser = currentUser && currentUser.id === guesser.id;

        if (isGuesser && !shownMessage) {
            this.props.enqueueSnackbar(i18n.t('GAME.MESSAGE.YOUR_TURN', 'Du bist dran!', { context: 'GUESSING' }), {
                variant: 'info',
                preventDuplicate: true,
                onClose: ()=>{ if(this._isMounted) this.setState({shownMessage: true}); }
            });
        }

        const currentWord = isGuesser ? '?' : (game.currentWord || '');
        const currentHints = game.hints.map((hintObj: IHint, index: number) => {
            const hint: string = hintObj.hint;
            const hintIsMine = currentUser && currentUser.id === hintObj.author;
            const author = getUserInGame(game, hintObj.author) || { name: '?', id: '?' };
            const authorName = hintIsMine ? i18n.t('COMMON.ME', 'Ich') : author.name;

            return (
                <WordHint 
                    key={hintObj.author+index} 
                    hint={hint} 
                    color={author.color}
                    showCross={isGuesser&&hintObj.isDuplicate}
                    duplicate={hintObj.isDuplicate}
                    author={authorName}
                />
            );
        });

        return (
            <Grid container spacing={4} className="Game-field">
                <Grid item xs={12} md={5} container spacing={2} className="Current-word">
                    <Grid item xs={12} component={Typography} variant="h5">
                        <Trans i18nKey="GAME.COMMON.WORD">Begriff</Trans>
                    </Grid>
                    <WordCard 
                        word={currentWord} 
                        guesser={guesser.name} 
                        isGuesser={isGuesser}
                        color={guesser.color} 
                        showInput={isGuesser}
                        submitHint={this.guess}/>
                </Grid>
                <Grid item xs={12} md={7} container spacing={2} className="Current-hints">
                    <Grid item xs={12} component={Typography} variant="h5">
                        <Trans i18nKey="GAME.COMMON.PLAYER_HINTS">Spieler-Hinweise</Trans>
                    </Grid>
                    {currentHints}
                </Grid>
            </Grid>
        );
    }
}

export default withSnackbar(GuessingView);
