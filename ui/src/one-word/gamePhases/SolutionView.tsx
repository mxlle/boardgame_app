import React from 'react';
import { Trans } from 'react-i18next';
import i18n from '../../i18n';
import { Grid, Button } from '@material-ui/core';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import { IGame, IHint } from '../../types';
import WordCard from '../components/WordCard';
import WordHint from '../components/WordHint';
import GameField from './GameField';

import * as api from '../../shared/apiFunctions';
import {getUserInGame} from "../gameFunctions";
import {getCurrentUserInGame} from "../../shared/functions";
import {nextTutorialStep} from "../tutorial";
import {StoreHelpers} from "react-joyride";
import TutorialOverlay from "../../common/TutorialOverlay";

type SolutionViewProps = {
    game: IGame
}&WithSnackbarProps;

type SolutionViewState = {
    shownMessage: boolean,
    shownResult: boolean,
    joyrideHelpers?: StoreHelpers
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
        if (this.props.game.$isTutorial) { nextTutorialStep(correct ? 'true' : undefined); this.state.joyrideHelpers?.close(); return; }
        api.resolveRound(this.props.game.id, correct);
    }

    render() {
        const game: IGame = this.props.game;
        const { shownMessage, shownResult } = this.state;
        const currentRound = game.rounds[game.round];
        const currentUser = getCurrentUserInGame(game);
        const guesser = getUserInGame(game, currentRound.guesserId) ||  { name: '?', id: '?' };
        const guesserName = guesser.name;
        const isGuesser = currentUser && currentUser.id === guesser.id;
        const isRoundHost = currentUser && currentUser.id === currentRound.hostId;

        const currentWord = currentRound.word;
        const currentGuess = currentRound.guess;
        const currentHints = currentRound.hints.map((hintObj: IHint, index: number) => {
            const hintIsMine = currentUser && currentUser.id === hintObj.authorId;
            const author = getUserInGame(game, hintObj.authorId) || { name: '?', id: '?' };
            const authorName = hintIsMine ? i18n.t('COMMON.ME', 'Ich') : author.name;

            return (
                <WordHint 
                    key={hintObj.authorId+index}
                    hint={hintObj.hint} 
                    color={author.color}
                    author={authorName}
                    duplicate={hintObj.isDuplicate}
                />
            );
        });

        if (isRoundHost && !currentRound.correct && !shownMessage) {
            this.props.enqueueSnackbar(i18n.t('GAME.MESSAGE.YOUR_TURN', 'Du bist dran!', { context: 'SOLUTION' }), {
                variant: 'info',
                preventDuplicate: true,
                onClose: ()=>{ if(this._isMounted) this.setState({shownMessage: true}); }
            });
        }

        if (!shownResult) {
            const context = currentRound.correct ? 'CORRECT' : 'WRONG';
            const variant = currentRound.correct ? 'success' : 'warning';
            this.props.enqueueSnackbar(i18n.t('GAME.MESSAGE.RESULT', `${guesserName} hat geraten`, { context: context, guesserName: guesserName, guess: currentRound.guess }), {
                variant: variant,
                preventDuplicate: true,
                onClose: () =>{ if(this._isMounted) this.setState({shownResult: true}); }
            });
        }

        const leftCol = [];
        leftCol.push(
            <WordCard 
                key="wordCard"
                word={currentWord} 
                guesser={guesser.name} 
                isGuesser={isGuesser}
                color={guesser.color}
                guess={currentGuess} 
                guessedRight={currentRound.correct} />
        );
        if (currentRound.correct) {
            leftCol.push(
                <Grid item xs={12} key="button1">
                    <Button variant="contained" color="primary" onClick={() => this.resolveRound(true)}>
                        <Trans i18nKey="GAME.SOLUTION.CONTINUE">Weiter</Trans>
                    </Button>
                </Grid>
            );
        } else if (isRoundHost) {
            leftCol.push(
                <Grid item xs={12} key="button1">
                    <Button variant="contained" onClick={() => this.resolveRound(true)} className="submitBtn correct">
                        <Trans i18nKey="GAME.SOLUTION.CONTINUE_RIGHT">Das zählt trotzdem</Trans>
                    </Button>
                </Grid>,
                <Grid item xs={12} key="button2">
                    <Button variant="contained" color="primary" onClick={() => this.resolveRound(false)} className="submitBtn wrong">
                        <Trans i18nKey="GAME.SOLUTION.CONTINUE_WRONG">Leider falsch</Trans>
                    </Button>
                </Grid>
            );
        }

        if (game.$isTutorial) {
            leftCol.push(
                <TutorialOverlay game={game} getHelpers={(helpers) => { this.setState({joyrideHelpers: helpers}); }} key="tutorial" />
            )
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
