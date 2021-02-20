import React from 'react';
import { Trans } from 'react-i18next';
import i18n from '../../i18n';
import { IGame, GamePhase } from '../../types';
import {AppBar, createStyles, Theme, withStyles, WithStyles} from "@material-ui/core";
import CardIcon, { CardTypes } from "./CardIcon";
import {getCorrectRounds, getPlayerInGame, getWrongRounds} from "../gameFunctions";
import {getNameListString} from "../../shared/functions";

type GameStatsProps = {
    game: IGame
} & WithStyles<typeof styles>;

const styles = (theme: Theme) => createStyles({
    root: {
        width: '100%',
        height: 50,
        marginTop: 100
    },
    appbar: {
        top: 'auto',
        bottom: 0,
        marginBottom: 0,
    },
    contents: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: theme.spacing(1)
    },
    body: {
        '& .MuiCollapse-wrapperInner': {
            transform: 'translateY(-48px)',
        }
    },
    phase: {
        fontStyle: 'italic'
    }
});

class GameStats extends React.Component<GameStatsProps> {
    componentDidMount() {
        document.body.classList.add(this.props.classes.body);
    }

    componentWillUnmount() {
        document.body.classList.remove(this.props.classes.body);
    }

    render() {
        const {game, classes} = this.props;
        const currentRound = game.rounds[game.round];

        const actionRequiredFrom = getNameListString(game.actionRequiredFrom?.map(p => p.name) || []);

        const guesser = getPlayerInGame(game, currentRound.guesserId) || { name: '?' };
        const guesserName = guesser.name;

        let gamePhase;
        switch(game.phase) {
            case GamePhase.HintWriting:
                if (game.isTwoPlayerVariant) {
                    gamePhase = <Trans i18nKey="GAME.STATS.PHASE_WRITING_TWO_PLAYER">{{actionRequiredFrom}} schreibt Hinweise auf...</Trans>;
                } else {
                    gamePhase = <Trans i18nKey="GAME.STATS.PHASE_WRITING" count={game.actionRequiredFrom?.length}>{{actionRequiredFrom}} schreiben Hinweise auf...</Trans>;
                }
                break;
            case GamePhase.HintComparing: 
                gamePhase = <Trans i18nKey="GAME.STATS.PHASE_COMPARING">{{actionRequiredFrom}} überprüft die Hinweise ...</Trans>;
                break;
            case GamePhase.Guessing: 
                gamePhase = <Trans i18nKey="GAME.STATS.PHASE_GUESSING">{{actionRequiredFrom}} versucht den Begriff zu erraten...</Trans>;
                break;
            case GamePhase.Solution: 
                if (currentRound.correct) {
                    gamePhase = <Trans i18nKey="GAME.STATS.PHASE_SOLUTION">{{guesserName}} lag genau richtig!</Trans>;
                } else {
                    gamePhase = <Trans i18nKey="GAME.STATS.PHASE_SOLUTION_WRONG">{{guesserName}} lag daneben! {{actionRequiredFrom}} entscheidet ob es trotzdem zählt...</Trans>;
                }
                break;
        }

        const round = game.round+1;
        const roundCount = game.rounds.length;
        const rightCount = getCorrectRounds(game).length;
        const wrongCount = getWrongRounds(game).length;

        return (
            <div className={classes.root}>
                <AppBar position="fixed" color="default" className={classes.appbar}>
                    <div className={classes.contents}>
                        <div>
                            <Trans i18nKey="GAME.STATS.ROUND">
                                Runde {{round}}/{{roundCount}}
                            </Trans>
                        </div>
                        <div className={classes.phase}>{gamePhase}</div>
                        <div>
                            <CardIcon type={CardTypes.CORRECT} title={i18n.t('GAME.STATS.RIGHT', {rightCount}).toString()}>{rightCount}</CardIcon>
                            <CardIcon type={CardTypes.WRONG} title={i18n.t('GAME.STATS.WRONG', {wrongCount}).toString()}>{wrongCount}</CardIcon>
                        </div>
                    </div>
                </AppBar>
            </div>
        );
    }
}

export default withStyles(styles)(GameStats);
