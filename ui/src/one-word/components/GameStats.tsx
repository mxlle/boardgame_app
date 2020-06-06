import React from 'react';
import { Trans } from 'react-i18next';
import i18n from '../../i18n';
import { IGame, GamePhase } from '../../types';
import { getUserInGame } from '../../shared/functions';
import {AppBar, createStyles, Theme, withStyles, WithStyles} from "@material-ui/core";
import CardIcon, { CardTypes } from "./CardIcon";

type GameStatsProps = {
    game: IGame
} & WithStyles<typeof styles>;

const styles = (theme: Theme) => createStyles({
    root: {
        width: '100%',
        height: 50,
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

        const roundHost = getUserInGame(game, game.roundHost) || { name: '?' };
        const roundHostName = roundHost.name;
        const guesser = getUserInGame(game, game.currentGuesser) || { name: '?' };
        const guesserName = guesser.name;

        let gamePhase;
        switch(game.phase) {
            case GamePhase.HintWriting: 
                const players = game.players.filter(p => game.currentGuesser && p.id !== game.currentGuesser).map(p => p.name);
                const playersString = players.slice(0, players.length-1).join(', ') + ' und ' + players[players.length-1];
                gamePhase = <Trans i18nKey="GAME.STATS.PHASE_WRITING">{{playersString}} schreiben Hinweise auf...</Trans>;
                break;
            case GamePhase.HintComparing: 
                gamePhase = <Trans i18nKey="GAME.STATS.PHASE_COMPARING">{{roundHostName}} überprüft die Hinweise ...</Trans>;
                break;
            case GamePhase.Guessing: 
                gamePhase = <Trans i18nKey="GAME.STATS.PHASE_GUESSING">{{guesserName}} versucht den Begriff zu erraten...</Trans>;
                break;
            case GamePhase.Solution: 
                if (game.guessedRight) {
                    gamePhase = <Trans i18nKey="GAME.STATS.PHASE_SOLUTION">{{guesserName}} lag genau richtig!</Trans>;
                } else {
                    gamePhase = <Trans i18nKey="GAME.STATS.PHASE_SOLUTION_WRONG">{{roundHostName}} lag daneben! {{guesserName}} entscheidet ob es trotzdem zählt...</Trans>;
                }
                break;
        }

        const round = game.round+1;
        const roundCount = game.words.length;
        const rightCount = game.correctWords.length;
        const wrongCount = game.wrongWords.length;

        return (
            <div className={classes.root}>
                <AppBar position="fixed" color="default" className={classes.appbar}>
                    <div className={classes.contents}>
                        <div>
                            <Trans i18nKey="GAME.STATS.ROUND">
                                Runde {{round}}/{{roundCount}}
                            </Trans>
                        </div>
                        <div><Trans i18nKey="GAME.STATS.PHASE">Phase</Trans>: {gamePhase}</div>
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
