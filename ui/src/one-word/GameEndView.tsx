import React from 'react';
import {Trans, WithTranslation, withTranslation} from 'react-i18next';
import {withSnackbar, WithSnackbarProps} from 'notistack';
import {Box, Button, createStyles, Grid, Theme, Typography, withStyles} from '@material-ui/core';
import WordCard from './components/WordCard';
import {GameEvent, IGame, IGameRound} from '../types';
import {emptyGame, getCorrectRounds, getPlayerInGame, getWrongRounds} from "./gameFunctions";
import TutorialOverlay from "../common/TutorialOverlay";
import {OneWordGameChildProps} from "./OneWordGame";
import Evaluation from "./components/Evaluation";
import {WithStyles} from "@material-ui/core/styles";
import {getCurrentUserInGame, getGameDuration} from "../shared/functions";
import {removeTutorial, TUTORIAL_ID} from "./tutorial";
import socket from "../shared/socket";
import {getCurrentLanguage} from "../i18n";
import api from "../shared/apiFunctions";
import {RouteComponentProps, withRouter} from "react-router-dom";
import ConfettiButton from "../common/ConfettiButton";
import TimerIcon from '@material-ui/icons/Timer';
import {createAiGame, triggerAiConfetti} from "../shared/sharedUiFunctions";

const styles = (theme: Theme) => createStyles({
    timeBox: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: theme.spacing(1),
      marginTop: theme.spacing(8),
      '& > svg': {
          marginRight: theme.spacing(1)
      }
    },
    buttons: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: theme.spacing(2),
        '& > *': {
            margin: theme.spacing(1)
        }
    }
});

type GameEndViewProps = {
    game: IGame
    triggerConfetti: (colors?: string[], amount?: number)=>void,
}&WithTranslation&RouteComponentProps&WithSnackbarProps&OneWordGameChildProps&WithStyles<typeof styles>;
class GameEndView extends React.Component<GameEndViewProps> {
    private _isMounted: boolean = false;

    componentDidMount() {
        this._isMounted = true;
        this.playAgain = this.playAgain.bind(this);
    }

    componentWillUnmount() {
        this._isMounted = false;
        this.props.closeSnackbar();
    }

    async playAgain() {
        const { game, i18n } = this.props;
        if (!game) return;

        if (game.rematchId) {
            this.props.history.push('/'+game.rematchId);
        } else {
            const rematch: IGame = emptyGame();
            rematch.name = game.name + ' - ' + i18n.t('GAME.AGAIN', 'Again!');
            rematch.language = getCurrentLanguage();
            rematch.isOnlyGuessing = game.isOnlyGuessing;

            try {
                const rematchId = await api.addGame(rematch, game.id);

                if (game.isSinglePlayerGame) {
                    await createAiGame(rematchId, game.players.length - 1, game.isOnlyGuessing);
                    void api.startPreparation(rematchId, game.wordsPerPlayer);
                }

                this.props.history.push('/'+rematchId);

            } catch(e) {
                this.props.enqueueSnackbar(<Trans i18nKey="ERROR.CREATE_GAME">Error</Trans>, { variant: 'error' });
            }
        }
    }

    render() {
        const { game, triggerConfetti, classes, history, i18n } = this.props;
        const correctWords = getCorrectRounds(game).map((round: IGameRound, index: number) => {
            return <WordCard key={index} small guesser={getPlayerInGame(game, round.guesserId)} word={round.word} guess={round.guess} guessedRight={true}/>
        });
        const wrongWords = getWrongRounds(game).map((round: IGameRound, index: number) => {
            return <WordCard key={index} small guesser={getPlayerInGame(game, round.guesserId)} word={round.word} guess={round.guess} guessedRight={false}/>
        });
        const total = game.rounds.length;
        let gameTime;

        if (game.endTime && game.startTime) {
            const duration = new Date(game.endTime).getTime() - new Date(game.startTime).getTime();
            const {days, hours, minutes, seconds} = getGameDuration(duration);

            const timeStrings: string[] = [];
            if (days > 0) timeStrings.push(i18n.t('COMMON.DAYS', { count: days }));
            if (hours > 0) timeStrings.push(i18n.t('COMMON.HOURS', { count: hours }));
            if (minutes > 0) timeStrings.push(i18n.t('COMMON.MINUTES', { count: minutes }));
            if (seconds > 0) timeStrings.push(i18n.t('COMMON.SECONDS', { count: seconds }));
            const time = timeStrings.join(', ');

            gameTime = (
                <Grid item xs={12}>
                    <Box className={classes.timeBox}>
                        <TimerIcon/> <Trans i18nKey="GAME.COMMON.TIME">Time: {{ time }}</Trans>
                    </Box>
                </Grid>
            );
        }

        const currentUser = getCurrentUserInGame(game);

        const backToList = () => {
            if (game.$isTutorial) removeTutorial();
            history.push('/');
        };

        const sendConfetti = () => {
            if (game?.id === TUTORIAL_ID) {
                triggerConfetti();
            } else {
                const color = currentUser?.color;
                const colors = color ? [color] : undefined;
                socket.emit(GameEvent.Confetti, game.id, colors);
                triggerConfetti(colors);

                if (game.isSinglePlayerGame) {
                    void triggerAiConfetti(game, triggerConfetti);
                }
            }
        }

        return (
            <Grid container spacing={4} className="Game-end-view">
                <Evaluation players={game.players} correctCount={correctWords.length} totalCount={total}/>
                <Grid item xs={12} md={6} container spacing={2} className="Correct-words">
                    <Grid item xs={12} component={Typography} variant="h4">
                        <Trans i18nKey="GAME.END.RIGHT" count={correctWords.length} tOptions={{total}}>Correct</Trans>
                    </Grid>
                    {correctWords}
                </Grid>
                <Grid item xs={12} md={6} container spacing={2} className="Wrong-words">
                    <Grid item xs={12} component={Typography} variant="h4">
                        <Trans i18nKey="GAME.END.WRONG" count={wrongWords.length} tOptions={{total}}>Wrong</Trans>
                    </Grid>
                    {wrongWords}
                </Grid>
                {gameTime}
                <Grid item xs={12} className={classes.buttons}>
                    {!game.$isTutorial && (
                        <Button variant="contained" color="primary" onClick={() => this.playAgain()}>
                            <Trans i18nKey="GAME.AGAIN">Again!</Trans>
                        </Button>
                    )}
                    <Button variant="outlined" onClick={backToList}>
                        <Trans i18nKey={game.$isTutorial ? 'TUTORIAL.CLOSE' : 'GAME.BACK_HOME'}>Back</Trans>
                    </Button>
                    {currentUser && <ConfettiButton onConfetti={sendConfetti}/>}
                </Grid>
                <TutorialOverlay game={game} key="tutorial" />
            </Grid>
        );
    }
}

export default withTranslation()(withRouter(withSnackbar(withStyles(styles)(GameEndView))));
