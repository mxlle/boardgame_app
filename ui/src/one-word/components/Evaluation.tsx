import React from 'react';
import {Trans} from 'react-i18next';
import {createStyles, Grid, Theme, Typography, withStyles} from '@material-ui/core';
import {IUser} from "../../types";
import {WithStyles} from "@material-ui/core/styles";
import ProgressBar from "../../common/ProgressBar";
import {easeInQuad} from "../../shared/functions";
import {getRandomColor} from "../../shared/color-util";

const RESULT_ANIMATION_MILLIS = 1000;

const styles = (theme: Theme) => createStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: theme.spacing(2),
    },
    progressBar: {
        margin: theme.spacing(2, 0),
    },
    percentage: {
        fontSize: theme.spacing(3),
        fontWeight: 'bold'
    },
    emoji: {
        fontSize: theme.spacing(10),
    }
});

type EvaluationProps = {
    players: IUser[],
    correctCount: number;
    totalCount: number;
}&WithStyles<typeof styles>;

type EvaluationState = {
    easedPercentage: number,
}

class Evaluation extends React.Component<EvaluationProps, EvaluationState> {
    public state: EvaluationState = {
        easedPercentage: 0,
    }
    private _isMounted: boolean = false;
    private _linearPercentage: number = 0;
    private _timeout: number | undefined = undefined;

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        const {players, correctCount, totalCount, classes} = this.props;
        const {easedPercentage} = this.state;
        const colors: string[] = players.map(p => p.color || getRandomColor());
        const resultPercentage = Math.ceil(correctCount / totalCount * 100);
        let resultEmoji = '🤔';
        let emojiStyle: React.CSSProperties = { transform: `scale(${easedPercentage/resultPercentage})` };

        if (easedPercentage < resultPercentage && !this._timeout) {
            this._timeout = window.setTimeout(() => {
                this._timeout = undefined;
                if (this._isMounted) {
                    this._linearPercentage = this._linearPercentage + 1;
                    this.setState({
                        easedPercentage: easeInQuad(this._linearPercentage, resultPercentage)
                    });
                }
            }, RESULT_ANIMATION_MILLIS / resultPercentage);
        }

        if (easedPercentage < 20) {
            resultEmoji = '😵';
        } else if (easedPercentage < 50) {
            resultEmoji = '🥴';
        } else if (easedPercentage < 75) {
            resultEmoji = '🙂';
        } else if (easedPercentage < 100) {
            resultEmoji = '😎';
        } else if (easedPercentage === 100) {
            resultEmoji = '🤩';
        }

        return (
            <Grid item xs={12} container spacing={2} className={classes.root}>
                <Typography variant="h3"><Trans i18nKey="GAME.END.HEADING">Game over</Trans></Typography>
                <ProgressBar value={easedPercentage} colors={colors} className={classes.progressBar}/>
                <Typography variant="body1" className={classes.percentage}>{easedPercentage} %</Typography>
                <Typography variant="body1" className={classes.emoji} style={emojiStyle}>{resultEmoji}</Typography>
            </Grid>
        );
    }
}

export default withStyles(styles)(Evaluation);
