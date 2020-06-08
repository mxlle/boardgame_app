import React from 'react';
import { Trans } from 'react-i18next';
import i18n from '../../i18n';
import { Grid, Button, Typography } from '@material-ui/core';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import { IGame, IHint } from '../../types';
import WordCard from '../components/WordCard';
import WordHint from '../components/WordHint';
import GameField from './GameField';

import * as api from '../../shared/apiFunctions';
import {getUserInGame} from "../gameFunctions";
import {getCurrentUserInGame} from "../../shared/functions";
import {nextTutorialStep, toggleDuplicateInTutorial} from "../tutorial";
import TutorialOverlay from "../../common/TutorialOverlay";
import {OneWordGameChildProps} from "../OneWordGame";

type HintComparingViewProps = {
    game: IGame
}&WithSnackbarProps&OneWordGameChildProps;

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

    async toggleDuplicate(hintIndex: number) {
        if (this.props.game.$isTutorial) { toggleDuplicateInTutorial(this.props.game, hintIndex); this.props.triggerReload(); return; }
        await api.toggleDuplicate(this.props.game.id, hintIndex);
        this.props.triggerReload();
    }

    async showHints() {
        if (this.props.game.$isTutorial) { nextTutorialStep(); this.props.triggerReload(); return; }
        await api.showHints(this.props.game.id);
        this.props.triggerReload();
    }

    render() {
        const game: IGame = this.props.game;
        const { shownMessage } = this.state;
        const currentRound = game.rounds[game.round];
        const currentUser = getCurrentUserInGame(game);
        const guesser = getUserInGame(game, currentRound.guesserId) || { name: '?', id: '?' };
        const isGuesser = currentUser && currentUser.id === guesser.id;
        const guesserName = guesser.name;
        const isRoundHost = currentUser && currentUser.id === currentRound.hostId;

        if (isRoundHost && !shownMessage) {
            this.props.enqueueSnackbar(i18n.t('GAME.MESSAGE.YOUR_TURN', 'Du bist dran!', { context: 'HINT_COMPARING' }), {
                variant: 'info',
                preventDuplicate: true
            });
            setTimeout(() => this.setState({shownMessage: true}), 0);
        }

        const currentWord = isGuesser ? '?' : (currentRound.word || '');
        const currentHints = currentRound.hints.map((hintObj: IHint, index: number) => {
            const hintIsMine = currentUser && currentUser.id === hintObj.authorId;
            const author = getUserInGame(game, hintObj.authorId) || { name: '?', id: '?' };
            const authorName = hintIsMine ? i18n.t('COMMON.ME', 'Ich') : author.name;

            return (
                <WordHint 
                    key={hintObj.authorId+index}
                    hint={hintObj.hint} 
                    color={author.color}
                    showCheck={isGuesser}
                    showCross={isGuesser&&hintObj.isDuplicate}
                    duplicate={hintObj.isDuplicate}
                    toggleDuplicate={isRoundHost ? ()=>this.toggleDuplicate(index) : undefined}
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
                    <Button variant="contained" color="primary" onClick={this.showHints} className="submitBtn">
                        <Trans i18nKey="GAME.COMPARING.BUTTON">{{guesserName}} kann losraten!</Trans>
                    </Button>
                </Grid>
            ));
        }

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

export default withSnackbar(HintComparingView);
