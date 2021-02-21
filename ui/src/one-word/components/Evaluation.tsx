import React from 'react';
import { Trans } from 'react-i18next';
import {createStyles, Grid, LinearProgress, Theme, Typography, withStyles} from '@material-ui/core';
import {IUser} from "../../types";
import {WithStyles} from "@material-ui/core/styles";

const styles = (theme: Theme) => createStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: theme.spacing(2),
    },
    progressBar: {
        width: '100%',
        height: theme.spacing(3),
        margin: theme.spacing(2),
    },
    percentage: {
        fontSize: theme.spacing(3),
        fontWeight: 'bold'
    },
    emoji: {
        fontSize: theme.spacing(8),
    }
});

type EvaluationProps = {
    players: IUser[],
    correctCount: number;
    totalCount: number;
}&WithStyles<typeof styles>;

type EvaluationState = {
    resultPercentage?: number
}

class Evaluation extends React.Component<EvaluationProps, EvaluationState> {
    private _isMounted: boolean = false;

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        const {players, correctCount, totalCount, classes} = this.props;
        const resultPercentage: number | undefined = this.state?.resultPercentage;

        let resultEmoji = '🤔';

        if (resultPercentage === undefined) {
            const backgroundGradient = `linear-gradient(to right, ${players.map(p => p.color).join(',')})`;
            try {
                document.styleSheets[document.styleSheets.length-1].insertRule(`.Game-end-view .MuiLinearProgress-bar { background: ${backgroundGradient}; }`);
            } catch (e) {
                console.log(e);
            }

            setTimeout(() => {
                if (this._isMounted) {
                    this.setState({
                        resultPercentage: Math.ceil(correctCount / totalCount * 100)
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
            <Grid item xs={12} container spacing={2} className={classes.root}>
                <Typography variant="h3"><Trans i18nKey="GAME.END.HEADING">Game over</Trans></Typography>
                <LinearProgress className={classes.progressBar} variant="determinate" value={resultPercentage || 0} />
                <Typography variant="body1" className={classes.percentage}>{resultPercentage || 0} %</Typography>
                <Typography variant="body1" className={classes.emoji}>{resultEmoji}</Typography>
            </Grid>
        );
    }
}

export default withStyles(styles)(Evaluation);
