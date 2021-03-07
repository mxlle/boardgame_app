import React from 'react';
import {WithTranslation, withTranslation} from "react-i18next";
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

type GuessingViewProps = {
    game: IGame
}&WithTranslation&OneWordGameChildProps;

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
        const {game, i18n} = this.props;
        const currentRound = game.rounds[game.round];
        const currentUser = getCurrentUserInGame(game);
        const guesser = getPlayerInGame(game, currentRound.guesserId) || { name: '?', id: '?' };
        const isGuesser = currentUser && currentUser.id === guesser.id;
        const isGameHost: boolean = !!currentUser?.id && game.hostId === currentUser.id;

        const currentWord = isGuesser || !currentUser ? '?' : (currentRound.word || '');
        const currentHints = currentRound.hints.map((hintObj: IHint) => {
            const hint: string = hintObj.hint;
            const hintIsMine = currentUser && currentUser.id === hintObj.authorId;
            const author = getPlayerInGame(game, hintObj.authorId) || { name: '?', id: '?' };
            const authorName = hintIsMine ? i18n.t('COMMON.ME', 'Me') : author.name;

            return (
                <WordHint 
                    key={hintObj.id}
                    hint={hint} 
                    color={author.color}
                    showCross={isGuesser&&hintObj.isDuplicate}
                    duplicate={hintObj.isDuplicate}
                    author={authorName}
                />
            );
        });

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

                rightCol={currentHints}
            />
        );
    }
}

export default withTranslation()(GuessingView);
