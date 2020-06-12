import React from 'react';
import i18n from '../../i18n';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import { IGame, IHint } from '../../types';
import WordCard from '../components/WordCard';
import WordHint from '../components/WordHint';
import GameField from './GameField';

import api from '../../shared/apiFunctions';
import {getPlayerInGame} from "../gameFunctions";
import {getCurrentUserInGame} from "../../shared/functions";
import {nextTutorialStep} from "../tutorial";
import TutorialOverlay from "../../common/TutorialOverlay";
import {OneWordGameChildProps} from "../OneWordGame";

type GuessingViewProps = {
    game: IGame
}&WithSnackbarProps&OneWordGameChildProps;

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

    async guess(guess: string) {
        if (this.props.game.$isTutorial) { nextTutorialStep(guess); return; }
        await api.guess(this.props.game.id, guess);
    }

    render() {
        const game: IGame = this.props.game;
        const { shownMessage } = this.state;
        const currentRound = game.rounds[game.round];
        const currentUser = getCurrentUserInGame(game);
        const guesser = getPlayerInGame(game, currentRound.guesserId) || { name: '?', id: '?' };
        const isGuesser = currentUser && currentUser.id === guesser.id;

        if (isGuesser && !shownMessage) {
            this.props.enqueueSnackbar(i18n.t('GAME.MESSAGE.YOUR_TURN', 'Du bist dran!', { context: 'GUESSING' }), {
                variant: 'info',
                preventDuplicate: true
            });
            setTimeout(() => this.setState({shownMessage: true}), 0);
        }

        const currentWord = isGuesser ? '?' : (currentRound.word || '');
        const currentHints = currentRound.hints.map((hintObj: IHint, index: number) => {
            const hint: string = hintObj.hint;
            const hintIsMine = currentUser && currentUser.id === hintObj.authorId;
            const author = getPlayerInGame(game, hintObj.authorId) || { name: '?', id: '?' };
            const authorName = hintIsMine ? i18n.t('COMMON.ME', 'Ich') : author.name;

            return (
                <WordHint 
                    key={hintObj.authorId+index}
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
                        submitGuess={isGuesser ? this.guess : undefined}
                        key="1" />),
                    <TutorialOverlay game={game} key="tutorial" />
                ]}

                rightCol={currentHints}
            />
        );
    }
}

export default withSnackbar(GuessingView);
