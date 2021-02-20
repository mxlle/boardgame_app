import React from 'react';
import { Trans } from 'react-i18next';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import {Grid, LinearProgress, Typography} from '@material-ui/core';
import WordCard from './components/WordCard';
import {IGame, IGameRound} from '../types';
import { getCorrectRounds, getPlayerInGame, getWrongRounds} from "./gameFunctions";
import TutorialOverlay from "../common/TutorialOverlay";
import {OneWordGameChildProps} from "./OneWordGame";

type GameEndViewProps = {
    game: IGame
}&WithSnackbarProps&OneWordGameChildProps;

type GameEndViewState = {
    resultPercentage?: number
}

class GameEndView extends React.Component<GameEndViewProps, GameEndViewState> {
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
        const resultPercentage: number | undefined = this.state?.resultPercentage;
        const correctWords = getCorrectRounds(game).map((round: IGameRound, index: number) => {
            return <WordCard key={index} small guesser={getPlayerInGame(game, round.guesserId)} word={round.word} guess={round.guess} guessedRight={true}/>
        });
        const wrongWords = getWrongRounds(game).map((round: IGameRound, index: number) => {
            return <WordCard key={index} small guesser={getPlayerInGame(game, round.guesserId)} word={round.word} guess={round.guess} guessedRight={false}/>
        });
        const total = game.rounds.length;
        let resultEmoji = '🤔';

        if (resultPercentage === undefined) {
            const backgroundGradient = `linear-gradient(to right, ${game.players.map(p => p.color).join(',')})`;
            try {
                document.styleSheets[document.styleSheets.length-1].insertRule(`.Game-end-view .Evaluation .MuiLinearProgress-bar { background: ${backgroundGradient}; }`);
            } catch (e) {
                console.log(e);
            }

            setTimeout(() => {
                if (this._isMounted) {
                    this.setState({
                        resultPercentage: Math.ceil(correctWords.length / total * 100)
                    })
                }
            }, 1000);
        } else {
            if (resultPercentage < 25) {
                resultEmoji = '😵';
            } else if (resultPercentage < 51) {
                resultEmoji = '🥴';
            } else if (resultPercentage < 100) {
                resultEmoji = '😎';
            } else if (resultPercentage === 100) {
                resultEmoji = '🤩';
            }
        }

        return (
            <Grid container spacing={4} className="Game-end-view">
                <Grid item xs={12} container spacing={2} className="Evaluation">
                    <Typography variant="h3"><Trans i18nKey="GAME.END.HEADING">Game over</Trans></Typography>
                    <LinearProgress variant="determinate" value={resultPercentage || 0} />
                    <Typography variant="body1" className="Percentage">{resultPercentage || 0} %</Typography>
                    <Typography variant="body1" className="ResultEmoji">{resultEmoji}</Typography>
                </Grid>
                <Grid item xs={12} md={6} container spacing={2} className="Correct-words">
                    <Grid item xs={12} component={Typography} variant="h4">
                        <Trans i18nKey="GAME.END.RIGHT" count={correctWords.length} tOptions={{total}}>Richtig</Trans>
                    </Grid>
                    {correctWords}
                </Grid>
                <Grid item xs={12} md={6} container spacing={2} className="Wrong-words">
                    <Grid item xs={12} component={Typography} variant="h4">
                        <Trans i18nKey="GAME.END.WRONG" count={wrongWords.length} tOptions={{total}}>Falsch</Trans>
                    </Grid>
                    {wrongWords}
                </Grid>
                <TutorialOverlay game={game} key="tutorial" />
            </Grid>
        );
    }
}

export default withSnackbar(GameEndView);
