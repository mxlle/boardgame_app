import React from 'react';
import i18n from '../../i18n';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import { IGame, IHint } from '../../types';
import WordCard from '../components/WordCard';
import WordHint from '../components/WordHint';
import GameField from './GameField';

import * as api from '../../shared/apiFunctions';
import {getUserInGame} from "../gameFunctions";
import {getCurrentUserInGame} from "../../shared/functions";

type GuessingViewProps = {
    game: IGame
}&WithSnackbarProps;

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

    guess(guess: string) {
        api.guess(this.props.game.id, guess);
    }

    render() {
        const game: IGame = this.props.game;
        const { shownMessage } = this.state;
        const currentRound = game.rounds[game.round];
        const currentUser = getCurrentUserInGame(game);
        const guesser = getUserInGame(game, currentRound.guesserId) || { name: '?', id: '?' };
        const isGuesser = currentUser && currentUser.id === guesser.id;

        if (isGuesser && !shownMessage) {
            this.props.enqueueSnackbar(i18n.t('GAME.MESSAGE.YOUR_TURN', 'Du bist dran!', { context: 'GUESSING' }), {
                variant: 'info',
                preventDuplicate: true,
                onClose: ()=>{ if(this._isMounted) this.setState({shownMessage: true}); }
            });
        }

        const currentWord = isGuesser ? '?' : (currentRound.word || '');
        const currentHints = currentRound.hints.map((hintObj: IHint, index: number) => {
            const hint: string = hintObj.hint;
            const hintIsMine = currentUser && currentUser.id === hintObj.authorId;
            const author = getUserInGame(game, hintObj.authorId) || { name: '?', id: '?' };
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
                leftCol={(
                    <WordCard 
                        word={currentWord} 
                        guesser={guesser.name} 
                        isGuesser={isGuesser}
                        color={guesser.color} 
                        showInput={isGuesser}
                        submitHint={this.guess}/>
                )}

                rightCol={currentHints}
            />
        );
    }
}

export default withSnackbar(GuessingView);
