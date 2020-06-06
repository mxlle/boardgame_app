import React from 'react';
import i18n from '../../i18n';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import { IGame, IHint } from '../../types';
import WordCard from '../components/WordCard';
import WordHint from '../components/WordHint';
import GameField from './GameField';

import * as api from '../../shared/apiFunctions';
import {checkPrevResult, getUserInGame} from "../gameFunctions";
import {getCurrentUserInGame} from "../../shared/functions";

type HintWritingViewProps = {
    game: IGame
}&WithSnackbarProps;

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

    submitHint(hint: string) {
        api.submitHint(this.props.game.id, hint);
    }

    render() {
        const game: IGame = this.props.game;
        const { shownMessage, shownPrevResult } = this.state;
        const currentRound = game.rounds[game.round];
        const currentUser = getCurrentUserInGame(game);
        const guesser = getUserInGame(game, currentRound.guesserId) || { name: '?', id: '?' };
        const isGuesser = currentUser && currentUser.id === guesser.id;

        if (!shownPrevResult) checkPrevResult(game, this.props.enqueueSnackbar, ()=>{ if(this._isMounted) this.setState({shownPrevResult: true}); }, i18n);

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
                    preventDuplicate: true,
                    onClose: ()=>{ if(this._isMounted) this.setState({shownMessage: true}); }
                });
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
                />
            );
        });

        return (
            <GameField
                leftCol={(
                    <WordCard 
                        word={currentWord} 
                        guesser={guesser.name} 
                        isGuesser={isGuesser}
                        color={guesser.color} />
                )}

                rightCol={currentHints}
            />
        );
    }
}

export default withSnackbar(HintWritingView);
