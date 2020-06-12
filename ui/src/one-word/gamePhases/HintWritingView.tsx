import React from 'react';
import i18n from '../../i18n';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import { IGame, IHint } from '../../types';
import WordCard from '../components/WordCard';
import WordHint from '../components/WordHint';
import GameField from './GameField';

import api from '../../shared/apiFunctions';
import {checkPrevResult, getUserInGame} from "../gameFunctions";
import {getCurrentUserInGame} from "../../shared/functions";
import {nextTutorialStep, TUTORIAL_HINTS} from "../tutorial";
import TutorialOverlay from "../../common/TutorialOverlay";
import {OneWordGameChildProps} from "../OneWordGame";

type HintWritingViewProps = {
    game: IGame
}&WithSnackbarProps&OneWordGameChildProps;

type HintWritingViewState = {
    shownMessage: boolean,
    shownPrevResult: boolean
};

class HintWritingView extends React.Component<HintWritingViewProps, HintWritingViewState> {
    public state: HintWritingViewState = { shownMessage: false, shownPrevResult: false };
    private _isMounted: boolean = false;

    constructor(props: HintWritingViewProps) {
        super(props);

        this.submitHint = this.submitHint.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    async submitHint(hint: string) {
        if (this.props.game.$isTutorial) { nextTutorialStep(hint); return; }
        await api.submitHint(this.props.game.id, hint);
    }

    render() {
        const game: IGame = this.props.game;
        const { shownMessage, shownPrevResult } = this.state;
        const currentRound = game.rounds[game.round];
        const currentUser = getCurrentUserInGame(game);
        const guesser = getUserInGame(game, currentRound.guesserId) || { name: '?', id: '?' };
        const isGuesser = currentUser && currentUser.id === guesser.id;

        if (!shownPrevResult) {
            checkPrevResult(game, this.props.enqueueSnackbar, i18n, this.props.triggerConfetti);
            setTimeout(() => this.setState({shownPrevResult: true}), 0);
        }

        const currentWord = isGuesser ? '?' : (currentRound.word || '');
        const currentHints = currentRound.hints.map((hintObj: IHint, index: number) => {
            const hint: string = hintObj.hint;
            const hintIsMine = currentUser && currentUser.id === hintObj.authorId;
            const author = getUserInGame(game, hintObj.authorId) || { name: '?', id: '?' };
            const authorName = hintIsMine ? i18n.t('COMMON.ME', 'Ich') : author.name;
            const showHint = !hint || hintIsMine;
            const showInput = !hint && hintIsMine;

            if (hintIsMine && !hint && !shownMessage) {
                this.props.enqueueSnackbar(i18n.t('GAME.MESSAGE.YOUR_TURN', 'Du bist dran!', { context: 'HINT_WRITING' }), {
                    variant: 'info',
                    preventDuplicate: true
                });
                setTimeout(() => this.setState({shownMessage: true}), 0);
            }

            return (
                <WordHint 
                    key={hintObj.authorId+index}
                    hint={hint} 
                    color={author.color}
                    showPencil={!showInput && !hint}
                    submitHint={showInput ? this.submitHint : undefined}
                    showCheck={!showHint}
                    author={authorName}
                    defaultValue={game.$isTutorial && hintIsMine ? TUTORIAL_HINTS[currentRound.word][0] : undefined}
                />
            );
        });

        return (
            <GameField
                leftCol={[
                    (<WordCard
                        word={currentWord} 
                        guesser={guesser.name} 
                        isGuesser={isGuesser}
                        color={guesser.color}
                        key="1" />),
                    <TutorialOverlay game={game} key="tutorial" />
                ]}

                rightCol={currentHints}
            />
        );
    }
}

export default withSnackbar(HintWritingView);
