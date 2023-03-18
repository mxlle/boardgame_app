import React from 'react';
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

type GuessingViewProps = {
    game: IGame
}&OneWordGameChildProps;

type GuessingViewState = {};

class GuessingView extends React.Component<GuessingViewProps,GuessingViewState> {
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

    async guess(guess: string) {
        if (this.props.game.$isTutorial) { nextTutorialStep(guess); return; }
        await api.guess(this.props.game.id, guess);
    }

    render() {
        const {game} = this.props;
        const { guesser, isGuesser, isGameHost, currentWord } = extractGameData(game);

        return (
            <GameField
                leftCol={[
                    (<WordCard
                        word={currentWord} 
                        guesser={guesser}
                        isGuesser={isGuesser}
                        isGuessingPhase={true}
                        submitGuess={isGuesser ? this.guess : undefined}
                        key="1" />),
                    (<EndPhaseButton
                        show={isGameHost && !isGuesser && !game.isTwoPlayerVariant && !game.$isTutorial}
                        endPhase={() => this.guess('')}
                        actionRequiredFrom={game.actionRequiredFrom}
                        key="2"/>),
                    <TutorialOverlay game={game} key="tutorial" />
                ]}

                rightCol={<WordHintList game={game} />}
            />
        );
    }
}

export default GuessingView;
