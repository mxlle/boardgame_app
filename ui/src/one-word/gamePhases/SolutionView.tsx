import React from 'react';
import {Trans} from 'react-i18next';
import {Button, Grid} from '@material-ui/core';
import {IGame} from '../../types';
import WordCard from '../components/WordCard';
import GameField from './GameField';

import api from '../../shared/apiFunctions';
import {extractGameData} from "../../shared/functions";
import {nextTutorialStep} from "../tutorial";
import TutorialOverlay from "../../common/TutorialOverlay";
import {OneWordGameChildProps} from "../OneWordGame";
import EndPhaseButton from "../components/EndPhaseButton";
import WordHintList from "./WordHintList";

type SolutionViewProps = {
    game: IGame
}&OneWordGameChildProps;

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
        const {game} = this.props;
        const { currentRound, guesser, isGuesser, isRoundHost, isGameHost, currentWord } = extractGameData(game);

        const leftCol = [];
        leftCol.push(
            <WordCard 
                key="wordCard"
                word={currentWord} 
                guesser={guesser}
                isGuesser={isGuesser}
                guess={currentRound.guess}
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
        } else if (isRoundHost || (isGameHost && !isGuesser)) {
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
        } else if (isGameHost) {
            leftCol.push(<EndPhaseButton show={isGameHost && !game.$isTutorial && !game.isSinglePlayerGame} endPhase={() => this.resolveRound(false)} actionRequiredFrom={game.actionRequiredFrom} key="endPhase"/>,);
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
                rightCol={<WordHintList game={game} />}
            />
        );
    }
}

export default SolutionView;
