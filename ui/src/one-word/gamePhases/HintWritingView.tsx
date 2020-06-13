import React from 'react';
import i18n from '../../i18n';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import { IGame, IHint } from '../../types';
import WordCard from '../components/WordCard';
import WordHint from '../components/WordHint';
import GameField from './GameField';

import api from '../../shared/apiFunctions';
import {checkPrevResult, getPlayerInGame} from "../gameFunctions";
import {getCurrentUserInGame} from "../../shared/functions";
import {nextTutorialStep, TUTORIAL_HINTS} from "../tutorial";
import TutorialOverlay from "../../common/TutorialOverlay";
import {OneWordGameChildProps} from "../OneWordGame";
import {IconButton} from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';

type HintWritingViewProps = {
    game: IGame
}&WithSnackbarProps&OneWordGameChildProps;

type HintWritingViewState = {
    submittedHints: {[key: string]: { hint: string, reset?: boolean }},
    shownMessage: boolean,
    shownPrevResult: boolean
};

class HintWritingView extends React.Component<HintWritingViewProps, HintWritingViewState> {
    public state: HintWritingViewState = { submittedHints: {}, shownMessage: false, shownPrevResult: false };
    private _isMounted: boolean = false;

    constructor(props: HintWritingViewProps) {
        super(props);

        this.submitHint = this.submitHint.bind(this);
        this.resetHint = this.resetHint.bind(this);
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

    render() {
        const game: IGame = this.props.game;
        const { submittedHints, shownMessage, shownPrevResult } = this.state;
        const currentRound = game.rounds[game.round];
        const currentUser = getCurrentUserInGame(game);
        const guesser = getPlayerInGame(game, currentRound.guesserId) || { name: '?', id: '?' };
        const isGuesser = currentUser && currentUser.id === guesser.id;

        if (!shownPrevResult) {
            checkPrevResult(game, this.props.enqueueSnackbar, i18n, this.props.triggerConfetti);
            setTimeout(() => this.setState({shownPrevResult: true}), 0);
        }

        const currentWord = isGuesser ? '?' : (currentRound.word || '');
        const currentHints = currentRound.hints.map((hintObj: IHint) => {
            let hint: string = hintObj.hint;
            let defaultValue = '';
            const hintIsMine = currentUser && currentUser.id === hintObj.authorId;
            const author = getPlayerInGame(game, hintObj.authorId) || { name: '?', id: '?' };
            const authorName = hintIsMine ? i18n.t('COMMON.ME', 'Ich') : author.name;
            if (hintIsMine && submittedHints[hintObj.id]) {
                if (submittedHints[hintObj.id].reset) {
                    defaultValue = submittedHints[hintObj.id].hint;
                } else if (!hint) {
                    hint = submittedHints[hintObj.id].hint;
                }
            }
            const showHint = !hint || hintIsMine;
            const showInput = !hint && hintIsMine;

            if (game.$isTutorial && hintIsMine) defaultValue = TUTORIAL_HINTS[currentRound.word][0];

            if (hintIsMine && !hint && !shownMessage) {
                this.props.enqueueSnackbar(i18n.t('GAME.MESSAGE.YOUR_TURN', 'Du bist dran!', { context: 'HINT_WRITING' }), {
                    variant: 'info',
                    preventDuplicate: true
                });
                setTimeout(() => this.setState({shownMessage: true}), 0);
            }

            return (
                <WordHint 
                    key={hintObj.id}
                    hint={hint} 
                    color={author.color}
                    showPencil={!showInput && !hint}
                    submitHint={showInput ? (h) => this.submitHint(hintObj.id, h) : undefined}
                    showCheck={!showHint}
                    author={authorName}
                    defaultValue={defaultValue}
                >
                    {hintIsMine && !showInput && !game.$isTutorial && (
                        <IconButton color="primary" onClick={() => this.resetHint(hintObj.id, hint)}>
                            <EditIcon />
                        </IconButton>
                    )}
                </WordHint>
            );
        });

        return (
            <GameField
                leftCol={[
                    (<WordCard
                        word={currentWord} 
                        guesser={guesser}
                        isGuesser={isGuesser}
                        key="1" />),
                    <TutorialOverlay game={game} key="tutorial" />
                ]}

                rightCol={currentHints}
            />
        );
    }
}

export default withSnackbar(HintWritingView);
