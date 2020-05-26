import React from 'react';
import { Trans } from 'react-i18next';
import i18n from '../../i18n';
import { Grid, Button, Typography } from '@material-ui/core';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import { IGame, IHint } from '../../custom.d';
import { WordCard } from '../components/WordCard';
import { WordHint } from '../components/WordHint';
import GameField from './GameField';

import { getCurrentUserInGame, getUserInGame } from '../../shared/functions';
import * as api from '../../shared/apiFunctions';

type HintComparingViewProps = {
    game: IGame
}&WithSnackbarProps;

type HintComparingViewState = {
    shownMessage: boolean
};

class HintComparingView extends React.Component<HintComparingViewProps,HintComparingViewState> {
    public state: HintComparingViewState = { shownMessage: false };
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

    toggleDuplicate(hintIndex: number) {
        api.toggleDuplicate(this.props.game.id, hintIndex);
    }

    showHints() {
        api.showHints(this.props.game.id);
    }

    render() {
        const game: IGame = this.props.game;
        const { shownMessage } = this.state;
        const currentUser = getCurrentUserInGame(game);
        const guesser = getUserInGame(game, game.currentGuesser) || { name: '?', id: '?' };
        const isGuesser = currentUser && currentUser.id === guesser.id;
        const guesserName = guesser.name;
        const isRoundHost = currentUser && currentUser.id === game.roundHost;

        if (isRoundHost && !shownMessage) {
            this.props.enqueueSnackbar(i18n.t('GAME.MESSAGE.YOUR_TURN', 'Du bist dran!', { context: 'HINT_COMPARING' }), {
                variant: 'info',
                preventDuplicate: true,
                onClose: ()=>{ if(this._isMounted) this.setState({shownMessage: true}); }
            });
        }

        const currentWord = isGuesser ? '?' : (game.currentWord || '');
        const currentHints = game.hints.map((hintObj: IHint, index: number) => {
            const hintIsMine = currentUser && currentUser.id === hintObj.author;
            const author = getUserInGame(game, hintObj.author) || { name: '?', id: '?' };
            const authorName = hintIsMine ? i18n.t('COMMON.ME', 'Ich') : author.name;

            return (
                <WordHint 
                    key={hintObj.author+index} 
                    hint={hintObj.hint} 
                    color={author.color}
                    showCheck={isGuesser}
                    showCross={isGuesser&&hintObj.isDuplicate}
                    duplicate={hintObj.isDuplicate}
                    showDuplicateToggle={isRoundHost}
                    toggleDuplicate={()=>this.toggleDuplicate(index)}
                    author={authorName}
                />
            );
        });

        if (isRoundHost) { // TODO - maybe not use Grid for these elements (?)
            currentHints.push((
                <Grid item xs={12} component={Typography} variant="subtitle1" key="info">
                    <Trans i18nKey="GAME.COMPARING.INFO">Markiere ungültige Hinweise</Trans>
                </Grid>
            ),(
                <Grid item xs={12} key="button">
                    <Button variant="contained" color="primary" onClick={this.showHints}>
                        <Trans i18nKey="GAME.COMPARING.BUTTON">{{guesserName}} kann losraten!</Trans>
                    </Button>
                </Grid>
            ));
        }

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

export default withSnackbar(HintComparingView);