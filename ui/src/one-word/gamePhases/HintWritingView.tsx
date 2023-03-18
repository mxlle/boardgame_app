import React from 'react';
import {IGame} from '../../types';
import WordCard from '../components/WordCard';
import GameField from './GameField';
import WordHintList from "./WordHintList";

import api from '../../shared/apiFunctions';
import {extractGameData} from "../../shared/functions";
import {nextTutorialStep} from "../tutorial";
import TutorialOverlay from "../../common/TutorialOverlay";
import {OneWordGameChildProps} from "../OneWordGame";
import EndPhaseButton from "../components/EndPhaseButton";

type HintWritingViewProps = {
    game: IGame
}&OneWordGameChildProps;

type HintWritingViewState = {
    submittedHints: {[key: string]: { hint: string, reset?: boolean }},
};

class HintWritingView extends React.Component<HintWritingViewProps, HintWritingViewState> {
    public state: HintWritingViewState = { submittedHints: {} };
    private _isMounted: boolean = false;

    constructor(props: HintWritingViewProps) {
        super(props);

        this.submitHint = this.submitHint.bind(this);
        this.resetHint = this.resetHint.bind(this);
        this.forceEndPhase = this.forceEndPhase.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    async submitHint(hintId: string, hint: string) {
        this.setState((prevState) => {
            prevState.submittedHints[hintId] = {hint};
            return { submittedHints: prevState.submittedHints };
        });
        if (this.props.game.$isTutorial) { nextTutorialStep(hint); return; }
        await api.submitHint(this.props.game.id, hintId, hint);
    }

    async resetHint(hintId: string, hint: string) {
        this.setState((prevState) => {
            prevState.submittedHints[hintId] = {hint, reset: true};
            return { submittedHints: prevState.submittedHints };
        });
        await api.resetHint(this.props.game.id, hintId);
    }

    async forceEndPhase() {
        await api.endHintPhase(this.props.game.id);
    }

    render() {
        const {game} = this.props;
        const { submittedHints } = this.state;
        const { currentRound, currentUser, guesser, isGuesser, isGameHost, currentWord } = extractGameData(game);
        let enteredHint: boolean = isGuesser || currentRound.hints.some((h) => h.authorId === currentUser?.id && !!h.hint);

        return (
            <GameField
                leftCol={[
                    (<WordCard
                        word={currentWord} 
                        guesser={guesser}
                        isGuesser={isGuesser}
                        key="1" />),
                    (<EndPhaseButton
                        show={isGameHost && enteredHint && !game.isTwoPlayerVariant && !game.$isTutorial}
                        endPhase={() => this.forceEndPhase()}
                        actionRequiredFrom={game.actionRequiredFrom}
                        key="2"/>),
                    <TutorialOverlay game={game} key="tutorial" />
                ]}

                rightCol={<WordHintList game={game} submittedHints={submittedHints} submitHint={this.submitHint} resetHint={this.resetHint} /> }
            />
        );
    }
}

export default HintWritingView;
