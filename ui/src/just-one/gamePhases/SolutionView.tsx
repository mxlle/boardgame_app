import React from 'react';
import { Trans } from 'react-i18next';
import i18n from '../../i18n';
import { Grid, Button } from '@material-ui/core';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import { IGame, IHint } from '../../custom.d';
import { WordCard } from '../components/WordCard';
import { WordHint } from '../components/WordHint';
import GameField from './GameField';

import { getCurrentUserInGame, getUserInGame } from '../../shared/functions';
import * as api from '../../shared/apiFunctions';

type SolutionViewProps = {
    game: IGame
}&WithSnackbarProps;

type SolutionViewState = {
    shownMessage: boolean,
    shownResult: boolean
};

class SolutionView extends React.Component<SolutionViewProps,SolutionViewState> {
    public state: SolutionViewState = { shownMessage: false, shownResult: false };
    private _isMounted: boolean = false;

    constructor(props: SolutionViewProps) {
        super(props);

        this.resolveRound = this.resolveRound.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    resolveRound(correct: boolean = true) {
        api.resolveRound(this.props.game.id, correct);
    }

    render() {
        const game: IGame = this.props.game;
        const { shownMessage, shownResult } = this.state;
        const currentUser = getCurrentUserInGame(game);
        const guesser = getUserInGame(game, game.currentGuesser) ||  { name: '?', id: '?' };
        const guesserName = guesser.name;
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
                    duplicate={hintObj.isDuplicate}
                />
            );
        });

        if (isRoundHost && !game.guessedRight && !shownMessage) {
            this.props.enqueueSnackbar(i18n.t('GAME.MESSAGE.YOUR_TURN', 'Du bist dran!', { context: 'SOLUTION' }), {
                variant: 'info',
                preventDuplicate: true,
                onClose: ()=>{ if(this._isMounted) this.setState({shownMessage: true}); }
            });
        }

        if (!shownResult) {
            const context = game.guessedRight ? 'CORRECT' : 'WRONG';
            const variant = game.guessedRight ? 'success' : 'warning';
            this.props.enqueueSnackbar(i18n.t('GAME.MESSAGE.RESULT', `${guesserName} hat geraten`, { context: context, guesserName: guesserName, guess: game.currentGuess }), {
                variant: variant,
                preventDuplicate: true,
                onClose: () =>{ if(this._isMounted) this.setState({shownResult: true}); }
            });
        }

        const leftCol = [];
        leftCol.push(
            <WordCard 
                word={currentWord} 
                guesser={guesser.name} 
                isGuesser={isGuesser}
                color={guesser.color}
                guess={currentGuess} 
                guessedRight={game.guessedRight} />
        );
        if (game.guessedRight) {
            leftCol.push(
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={() => this.resolveRound(true)}>
                        <Trans i18nKey="GAME.SOLUTION.CONTINUE">Weiter</Trans>
                    </Button>
                </Grid>
            );
        } else if (isRoundHost) {
            leftCol.push(
                <Grid item xs={12}>
                    <Button variant="contained" onClick={() => this.resolveRound(true)}>
                        <Trans i18nKey="GAME.SOLUTION.CONTINUE_RIGHT">Das zählt trotzdem</Trans>
                    </Button>
                </Grid>,
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={() => this.resolveRound(false)}>
                        <Trans i18nKey="GAME.SOLUTION.CONTINUE_WRONG">Leider falsch</Trans>
                    </Button>
                </Grid>
            );
        }

        return (
            <GameField
                leftCol={leftCol}
                rightCol={currentHints}
            />
        );
    }
}

export default withSnackbar(SolutionView);