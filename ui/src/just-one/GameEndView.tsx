import React from 'react';
import { Trans } from 'react-i18next';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import {Button, Grid, Typography} from '@material-ui/core';
import WordCard from './components/WordCard';
import { IGame } from '../custom.d';
import { checkPrevResult } from '../shared/functions';
import {removeTutorial} from "./tutorial";
import {RouteComponentProps, withRouter} from "react-router-dom";

type GameEndViewProps = {
    game: IGame
}&WithSnackbarProps&RouteComponentProps;

type HintWritingViewState = {
    shownPrevResult: boolean
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
        const correctWords = game.correctWords.map(wordResult => {
            return <WordCard key={wordResult.word} small word={wordResult.word} guess={wordResult.guess} guessedRight={true}/>
        });
        const wrongWords = game.wrongWords.map(wordResult => {
            return <WordCard key={wordResult.word} small word={wordResult.word} guess={wordResult.guess} guessedRight={false}/>
        });

        if (!shownPrevResult) {
            checkPrevResult(game, this.props.enqueueSnackbar, ()=>{ 
                if(this._isMounted) this.setState({shownPrevResult: true}); 
            });
        }

        const closeTutorial = () => {
            removeTutorial();
            this.props.history.push('/');
        };
        const returnButton = game.$isTutorial ? <Grid item xs={12}><Button onClick={closeTutorial}>Close Tutorial</Button></Grid> : null;

        return (
            <Grid container spacing={4} className="Game-end-view">
                { returnButton }
                <Grid item xs={12} md={6} container spacing={2} className="Correct-words">
                    <Grid item xs={12} component={Typography} variant="h4">
                        <Trans i18nKey="GAME.END.RIGHT" count={game.correctWords.length}>Richtig</Trans>
                    </Grid>
                    {correctWords}
                </Grid>
                <Grid item xs={12} md={6} container spacing={2} className="Wrong-words">
                    <Grid item xs={12} component={Typography} variant="h4">
                        <Trans i18nKey="GAME.END.WRONG" count={game.wrongWords.length}>Falsch</Trans>
                    </Grid>
                    {wrongWords}
                </Grid>
            </Grid>
        );
    }
}

export default withRouter(withSnackbar(GameEndView));
