import React from 'react';
import { Trans } from 'react-i18next';
import i18n from '../../i18n';
import { Typography } from '@material-ui/core';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import { IGame, IHint } from '../../custom.d';
import { WordCard } from '../components/WordCard';
import { WordHint } from '../components/WordHint';

import { getCurrentUserInGame, getUserInGame, checkPrevResult } from '../../shared/functions';
import * as api from '../../shared/apiFunctions';

type HintWritingViewProps = {
    game: IGame
}&WithSnackbarProps;

type HintWritingViewState = {
    shownMessage: boolean,
    shownPrevResult: boolean
};

class HintWritingView extends React.Component<HintWritingViewProps, HintWritingViewState> {
    public state: HintWritingViewState = { shownMessage: false, shownPrevResult: false };

    constructor(props: HintWritingViewProps) {
        super(props);

        this.submitHint = this.submitHint.bind(this);
    }

    submitHint(hint: string) {
        api.submitHint(this.props.game.id, hint);
    }

    render() {
        const game: IGame = this.props.game;
        const { shownMessage, shownPrevResult } = this.state;
        const currentUser = getCurrentUserInGame(game);
        const guesser = getUserInGame(game, game.currentGuesser) || { name: '?', id: '?' };
        const isGuesser = currentUser && currentUser.id === guesser.id;

        if (!shownPrevResult) checkPrevResult(game, this.props.enqueueSnackbar, ()=>this.setState({shownPrevResult: true}));

        const currentWord = isGuesser ? '?' : (game.currentWord || '');
        const currentHints = game.hints.map((hintObj: IHint, index: number) => {
            const hint: string = hintObj.hint;
            const hintIsMine = currentUser && currentUser.id === hintObj.author;
            const author = getUserInGame(game, hintObj.author) || { name: '?', id: '?' };
            const authorName = hintIsMine ? i18n.t('COMMON.ME', 'Ich') : author.name;
            const showHint = !hint || hintIsMine;
            const showInput = !hint && hintIsMine;

            if (hintIsMine && !hint && !shownMessage) {
                this.props.enqueueSnackbar(i18n.t('GAME.MESSAGE.YOUR_TURN', 'Du bist dran!', { context: 'HINT_WRITING' }), {
                    variant: 'info',
                    preventDuplicate: true,
                    onClose: () => this.setState({shownMessage: true})
                });
            }

            return (
                <WordHint 
                    key={hintObj.author+index} 
                    hint={hint} 
                    color={author.color}
                    showInput={showInput}
                    submitHint={this.submitHint}
                    showCheck={!showHint}
                    author={authorName}
                />
            );
        });

        return (
            <div className="Game-field">
                <div className="Current-word">
                    <Typography variant="h5">
                        <Trans i18nKey="GAME.COMMON.WORD">Begriff</Trans>
                    </Typography>
                    <WordCard 
                        word={currentWord} 
                        guesser={guesser.name} 
                        isGuesser={isGuesser}
                        color={guesser.color} />
                </div>
                <div className="Current-hints">
                    <Typography variant="h5">
                        <Trans i18nKey="GAME.COMMON.PLAYER_HINTS">Spieler-Hinweise</Trans>
                    </Typography>
                    <div className="WordHint-list">{currentHints}</div>
                </div>
            </div>
        );
    }
}

export default withSnackbar(HintWritingView);
