import React from 'react';
import { Trans } from 'react-i18next';
import {Grid, Button, Typography} from '@material-ui/core';
import {IGame} from '../../types';
import WordCard from '../components/WordCard';
import GameField from './GameField';

import api from '../../shared/apiFunctions';
import {extractGameData} from "../../shared/functions";
import {nextTutorialStep, toggleDuplicateInTutorial} from "../tutorial";
import TutorialOverlay from "../../common/TutorialOverlay";
import {OneWordGameChildProps} from "../OneWordGame";
import EndPhaseButton from "../components/EndPhaseButton";
import WordHintList from "./WordHintList";

type HintComparingViewProps = {
    game: IGame
}&OneWordGameChildProps;

type HintComparingViewState = {};

class HintComparingView extends React.Component<HintComparingViewProps,HintComparingViewState> {
    private _isMounted: boolean = false;

    constructor(props: HintComparingViewProps) {
        super(props);

        this.toggleDuplicate = this.toggleDuplicate.bind(this);
        this.showHints = this.showHints.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    async toggleDuplicate(hintId: string) {
        if (this.props.game.$isTutorial) { toggleDuplicateInTutorial(this.props.game, hintId); return; }
        await api.toggleDuplicateHint(this.props.game.id, hintId);
    }

    async showHints() {
        if (this.props.game.$isTutorial) { nextTutorialStep(); return; }
        await api.showHints(this.props.game.id);
    }

    render() {
        const {game} = this.props;
        const { guesser, isGuesser, isRoundHost, isGameHost, currentWord } = extractGameData(game);
        const guesserName = guesser.name;

        const hintElements = [<WordHintList game={game} toggleDuplicate={this.toggleDuplicate} />];
        if (isRoundHost) {
            hintElements.push((
                <Grid item xs={12} component={Typography} variant="subtitle1" key="info">
                    <Trans i18nKey="GAME.COMPARING.INFO">Mark invalid hints</Trans>
                </Grid>
            ),(
                <Grid item xs={12} key="button">
                    <Button variant="contained" color="primary" onClick={this.showHints} className="submitBtn">
                        <Trans i18nKey="GAME.COMPARING.BUTTON">{{guesserName}} can start!</Trans>
                    </Button>
                </Grid>
            ));
        }

        return (
            <GameField
                leftCol={[
                    (<WordCard
                        word={currentWord} 
                        guesser={guesser}
                        isGuesser={isGuesser}
                        key="1" />),
                    (<EndPhaseButton
                        show={isGameHost && !isRoundHost && !game.isTwoPlayerVariant && !game.$isTutorial}
                        endPhase={() => this.showHints()}
                        actionRequiredFrom={game.actionRequiredFrom}
                        key="2"/>),
                    game.$isTutorial && game.round === 1 ? (<Button onClick={() => {nextTutorialStep();}} className="tutorialBtn" key="tutorialBtn">
                        <Trans i18nKey="TUTORIAL.CONTINUE">Continue</Trans>
                    </Button>) : <span/>,
                    <TutorialOverlay game={game} key="tutorial" />
                ]}

                rightCol={hintElements}
            />
        );
    }
}

export default HintComparingView;
