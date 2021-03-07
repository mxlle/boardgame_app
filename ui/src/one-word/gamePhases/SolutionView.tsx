import React from 'react';
import { Trans, WithTranslation, withTranslation } from 'react-i18next';
import { Grid, Button } from '@material-ui/core';
import {IGame, IHint} from '../../types';
import WordCard from '../components/WordCard';
import WordHint from '../components/WordHint';
import GameField from './GameField';

import api from '../../shared/apiFunctions';
import {getPlayerInGame} from "../gameFunctions";
import {getCurrentUserInGame} from "../../shared/functions";
import {nextTutorialStep} from "../tutorial";
import TutorialOverlay from "../../common/TutorialOverlay";
import {OneWordGameChildProps} from "../OneWordGame";
import EndPhaseButton from "../components/EndPhaseButton";

type SolutionViewProps = {
    game: IGame
}&WithTranslation&OneWordGameChildProps;

type SolutionViewState = {};

class SolutionView extends React.Component<SolutionViewProps,SolutionViewState> {
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
        if (this.props.game.$isTutorial) { nextTutorialStep(correct ? 'true' : undefined); return; }
        await api.resolveRound(this.props.game.id, correct);
    }

    render() {
        const {game, i18n} = this.props;
        const currentRound = game.rounds[game.round];
        const currentUser = getCurrentUserInGame(game);
        const guesser = getPlayerInGame(game, currentRound.guesserId) ||  { name: '?', id: '?' };
        const isGuesser = currentUser && currentUser.id === guesser.id;
        const roundHost = getPlayerInGame(game, currentRound.hostId) || { name: '?', id: '?' };
        const isRoundHost = currentUser && currentUser.id === roundHost.id;
        const isGameHost: boolean = !!currentUser?.id && game.hostId === currentUser.id;

        const currentWord = currentRound.word;
        const currentGuess = currentRound.guess;
        const currentHints = currentRound.hints.map((hintObj: IHint) => {
            const hintIsMine = currentUser && currentUser.id === hintObj.authorId;
            const author = getPlayerInGame(game, hintObj.authorId) || { name: '?', id: '?' };
            const authorName = hintIsMine ? i18n.t('COMMON.ME', 'Me') : author.name;

            return (
                <WordHint 
                    key={hintObj.id}
                    hint={hintObj.hint} 
                    color={author.color}
                    author={authorName}
                    duplicate={hintObj.isDuplicate}
                />
            );
        });

        const leftCol = [];
        leftCol.push(
            <WordCard 
                key="wordCard"
                word={currentWord} 
                guesser={guesser}
                isGuesser={isGuesser}
                guess={currentGuess} 
                guessedRight={currentRound.correct} />
        );
        if (currentRound.correct) {
            leftCol.push(
                <Grid item xs={12} key="button1">
                    <Button variant="contained" color="primary" onClick={() => this.resolveRound(true)}>
                        <Trans i18nKey="GAME.SOLUTION.CONTINUE">Continue</Trans>
                    </Button>
                </Grid>
            );
        } else if (isRoundHost) {
            leftCol.push(
                <Grid item xs={12} key="button1">
                    <Button variant="contained" onClick={() => this.resolveRound(true)} className="submitBtn correct">
                        <Trans i18nKey="GAME.SOLUTION.CONTINUE_RIGHT">Correct!</Trans>
                    </Button>
                </Grid>,
                <Grid item xs={12} key="button2">
                    <Button variant="contained" color="primary" onClick={() => this.resolveRound(false)} className="submitBtn wrong">
                        <Trans i18nKey="GAME.SOLUTION.CONTINUE_WRONG">Wrong!</Trans>
                    </Button>
                </Grid>
            );
        } else if (isGameHost && !game.isTwoPlayerVariant) {
            leftCol.push(<EndPhaseButton show={isGameHost && !game.isTwoPlayerVariant && !game.$isTutorial} endPhase={() => this.resolveRound(false)} actionRequiredFrom={game.actionRequiredFrom} key="endPhase"/>,);
        }

        if (game.$isTutorial) {
            if (!currentRound.correct && !isRoundHost) {
                leftCol.push(
                    <Button onClick={() => {nextTutorialStep();}} className="tutorialBtn" key="tutorialBtn">
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

export default withTranslation()(SolutionView);
