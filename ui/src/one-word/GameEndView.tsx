import React from 'react';
import { Trans } from 'react-i18next';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import {Grid, Typography} from '@material-ui/core';
import WordCard from './components/WordCard';
import {IGame, IGameRound} from '../types';
import { getCorrectRounds, getPlayerInGame, getWrongRounds} from "./gameFunctions";
import TutorialOverlay from "../common/TutorialOverlay";
import {OneWordGameChildProps} from "./OneWordGame";

type GameEndViewProps = {
    game: IGame
}&WithSnackbarProps&OneWordGameChildProps;

class GameEndView extends React.Component<GameEndViewProps> {
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
        const correctWords = getCorrectRounds(game).map((round: IGameRound, index: number) => {
            return <WordCard key={index} small guesser={getPlayerInGame(game, round.guesserId)} word={round.word} guess={round.guess} guessedRight={true}/>
        });
        const wrongWords = getWrongRounds(game).map((round: IGameRound, index: number) => {
            return <WordCard key={index} small guesser={getPlayerInGame(game, round.guesserId)} word={round.word} guess={round.guess} guessedRight={false}/>
        });

        return (
            <Grid container spacing={4} className="Game-end-view">
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
                <TutorialOverlay game={game} key="tutorial" />
            </Grid>
        );
    }
}

export default withSnackbar(GameEndView);
