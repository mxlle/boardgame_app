import React from 'react';
import {Button} from "@material-ui/core";
import i18n from '../../i18n';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import { IGame, IHint } from '../../custom.d';
import WordCard from '../components/WordCard';
import WordHint from '../components/WordHint';
import GameField from './GameField';

import { getCurrentUserInGame, getUserInGame, checkPrevResult } from '../../shared/functions';
import * as api from '../../shared/apiFunctions';
import {nextTutorialStep} from "../tutorial";

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
        if (this.props.game.$isTutorial) { nextTutorialStep(hint); return; }
        api.submitHint(this.props.game.id, hint);
    }

    render() {
        const game: IGame = this.props.game;
        const { shownMessage, shownPrevResult } = this.state;
        const currentUser = getCurrentUserInGame(game);
        const guesser = getUserInGame(game, game.currentGuesser) || { name: '?', id: '?' };
        const isGuesser = currentUser && currentUser.id === guesser.id;

        if (!shownPrevResult) checkPrevResult(game, this.props.enqueueSnackbar, ()=>{ if(this._isMounted) this.setState({shownPrevResult: true}); });

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
                    onClose: ()=>{ if(this._isMounted) this.setState({shownMessage: true}); }
                });
            }

            return (
                <WordHint 
                    key={hintObj.author+index} 
                    hint={hint} 
                    color={author.color}
                    showPencil={!showInput && !hint}
                    submitHint={showInput ? this.submitHint : undefined}
                    showCheck={!showHint}
                    author={authorName}
                />
            );
        });

        const tutorialButton = game.$isTutorial && isGuesser ? <Button onClick={() => nextTutorialStep()} key="2">Weiter</Button> : <span key="2"/>;

        return (
            <GameField
                leftCol={[
                    (<WordCard
                        word={currentWord} 
                        guesser={guesser.name} 
                        isGuesser={isGuesser}
                        color={guesser.color}
                        key="1" />),
                    tutorialButton
                ]}

                rightCol={currentHints}
            />
        );
    }
}

/*
            <Grid container spacing={4} className="Game-field">
                <Grid item xs={12} md={5} container spacing={2} className="Current-word">
                    <Grid item xs={12} component={Typography} variant="h5">
                        <Trans i18nKey="GAME.COMMON.WORD">Begriff</Trans>
                    </Grid>
                    <WordCard 
                        word={currentWord} 
                        guesser={guesser.name} 
                        isGuesser={isGuesser}
                        color={guesser.color} />
                </Grid>
                <Grid item xs={12} md={7} container spacing={2} className="Current-hints">
                    <Grid item xs={12} component={Typography} variant="h5">
                        <Trans i18nKey="GAME.COMMON.PLAYER_HINTS">Spieler-Hinweise</Trans>
                    </Grid>
                    {currentHints}
                </Grid>
            </Grid>*/

export default withSnackbar(HintWritingView);
