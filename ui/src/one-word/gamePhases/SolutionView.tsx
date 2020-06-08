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
import TutorialOverlay from "../../common/TutorialOverlay";
import {OneWordGameChildProps} from "../OneWordGame";

type SolutionViewProps = {
    game: IGame
}&WithSnackbarProps&OneWordGameChildProps;

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

    async resolveRound(correct: boolean = true) {
        if (this.props.game.$isTutorial) { nextTutorialStep(correct ? 'true' : undefined); this.props.triggerReload(); return; }
        await api.resolveRound(this.props.game.id, correct);
        this.props.triggerReload();
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
                preventDuplicate: true
            });
            setTimeout(() => this.setState({shownMessage: true}), 0);
        }

        if (!shownResult) {
            const context = currentRound.correct ? 'CORRECT' : 'WRONG';
            const variant = currentRound.correct ? 'success' : 'warning';
            this.props.enqueueSnackbar(i18n.t('GAME.MESSAGE.RESULT', `${guesserName} hat geraten`, { context: context, guesserName: guesserName, guess: currentRound.guess }), {
                variant: variant,
                preventDuplicate: true
            });
            if (currentRound.correct && this.props.triggerConfetti) {
                this.props.triggerConfetti();
            }
            setTimeout(() => this.setState({shownResult: true}), 0);
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
            if (!currentRound.correct && !isRoundHost) {
                leftCol.push(
                    <Button onClick={() => {nextTutorialStep();this.props.triggerReload();}} className="tutorialBtn" key="tutorialBtn">
                        <Trans i18nKey="TUTORIAL.CONTINUE">Continue</Trans>
                    </Button>
                );
            }
            leftCol.push(
                <TutorialOverlay game={game} key="tutorial" />
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
