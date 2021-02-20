import React from 'react';
import { Trans } from 'react-i18next';
import i18n from '../../i18n';
import {IGame, GamePhase, IUser} from '../../types';
import {AppBar, createStyles, Theme, withStyles, WithStyles} from "@material-ui/core";
import CardIcon, { CardTypes } from "./CardIcon";
import {getCorrectRounds, getPlayerInGame, getWrongRounds} from "../gameFunctions";

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
        backgroundColor: theme.palette.background.paper,
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
    statusMessage: {
        color: theme.palette.text.secondary,
        fontWeight: 'bold',
    },
    nameTag: {
        '&.isFirst': {
            marginLeft: theme.spacing(0.5),
        },
        '&:not(.isFirst)': {
            '&:before': {
                color: theme.palette.text.secondary,
                content: '","',
                marginRight: theme.spacing(0.5),
            },
            '&.isLast:before': {
                content: '"&"',
                marginLeft: theme.spacing(0.5),
            }
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
        const currentRound = game.rounds[game.round];
        let listKey = 0;

        const getNameTag = (player: IUser, isFirst = true, isLast = true) => {
            let classNames = classes.nameTag;
            if (isFirst) classNames += ' isFirst';
            if (isLast) classNames += ' isLast';
            return <span className={classNames} style={{color: player.color}} key={listKey++}>{player.name}</span>;
        }


        const actionRequiredFrom = game.actionRequiredFrom.map((p, i, ps) => getNameTag(p, i === 0, i === ps.length-1));

        const guesser = getPlayerInGame(game, currentRound.guesserId) || { name: '?', id: '?' };

        let statusMessageElements: JSX.Element[] = [];
        switch(game.phase) {
            case GamePhase.HintWriting:
                if (game.isTwoPlayerVariant) {
                    statusMessageElements.push(...actionRequiredFrom, <Trans i18nKey="GAME.STATS.PHASE_WRITING_TWO_PLAYER">writes hints</Trans>);
                } else {
                    statusMessageElements.push(...actionRequiredFrom, <Trans i18nKey="GAME.STATS.PHASE_WRITING" count={game.actionRequiredFrom.length}>write hints</Trans>);
                }
                break;
            case GamePhase.HintComparing: 
                statusMessageElements.push(...actionRequiredFrom, <Trans i18nKey="GAME.STATS.PHASE_COMPARING">checks hints</Trans>);
                break;
            case GamePhase.Guessing: 
                statusMessageElements.push(...actionRequiredFrom, <Trans i18nKey="GAME.STATS.PHASE_GUESSING">guesses</Trans>);
                break;
            case GamePhase.Solution: 
                if (currentRound.correct) {
                    statusMessageElements.push(getNameTag(guesser), <Trans i18nKey="GAME.STATS.PHASE_SOLUTION">was right!</Trans>);
                } else {
                    statusMessageElements.push(getNameTag(guesser), <Trans i18nKey="GAME.STATS.PHASE_SOLUTION_WRONG">was wrong!</Trans>);
                    statusMessageElements.push(...actionRequiredFrom, <Trans i18nKey="GAME.STATS.PHASE_SOLUTION_WRONG_2">decides</Trans>);
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
                        <div className={classes.statusMessage}>{statusMessageElements}</div>
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
