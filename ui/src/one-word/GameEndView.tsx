import React from 'react';
import { Trans } from 'react-i18next';
import i18n from '../i18n';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import {Button, Grid, Typography} from '@material-ui/core';
import WordCard from './components/WordCard';
import { IGame } from '../types';
import {checkPrevResult, getCorrectRounds, getWrongRounds} from "./gameFunctions";
import {removeTutorial} from "./tutorial";
import {RouteComponentProps, withRouter} from "react-router-dom";
import {StoreHelpers} from "react-joyride";
import TutorialOverlay from "../common/TutorialOverlay";

type GameEndViewProps = {
    game: IGame
}&WithSnackbarProps&RouteComponentProps;

type HintWritingViewState = {
    shownPrevResult: boolean,
    joyrideHelpers?: StoreHelpers
};

class GameEndView extends React.Component<GameEndViewProps> {
    public state: HintWritingViewState = { shownPrevResult: false };
    private _isMounted: boolean = false;

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
        this.props.closeSnackbar();
    }

    render() {
        const game: IGame = this.props.game;
        const { shownPrevResult } = this.state;
        const correctWords = getCorrectRounds(game).map(round => {
            return <WordCard key={round.word} small word={round.word} guess={round.guess} guessedRight={true}/>
        });
        const wrongWords = getWrongRounds(game).map(round => {
            return <WordCard key={round.word} small word={round.word} guess={round.guess} guessedRight={false}/>
        });

        if (!shownPrevResult) {
            checkPrevResult(game, this.props.enqueueSnackbar, ()=>{ 
                if(this._isMounted) this.setState({shownPrevResult: true}); 
            }, i18n);
        }

        const closeTutorial = () => {
            this.state.joyrideHelpers?.close();
            removeTutorial();
            this.props.history.push('/');
        };

        const returnButton = game.$isTutorial ? <Grid item xs={12}><Button onClick={closeTutorial}>Close Tutorial</Button></Grid> : null;

        return (
            <Grid container spacing={4} className="Game-end-view">
                { returnButton }
                <Grid item xs={12} md={6} container spacing={2} className="Correct-words">
                    <Grid item xs={12} component={Typography} variant="h4">
                        <Trans i18nKey="GAME.END.RIGHT" count={correctWords.length}>Richtig</Trans>
                    </Grid>
                    {correctWords}
                </Grid>
                <Grid item xs={12} md={6} container spacing={2} className="Wrong-words">
                    <Grid item xs={12} component={Typography} variant="h4">
                        <Trans i18nKey="GAME.END.WRONG" count={wrongWords.length}>Falsch</Trans>
                    </Grid>
                    {wrongWords}
                </Grid>
                <TutorialOverlay game={game} getHelpers={(helpers) => { this.setState({joyrideHelpers: helpers}); }} key="tutorial" />
            </Grid>
        );
    }
}

export default withRouter(withSnackbar(GameEndView));
