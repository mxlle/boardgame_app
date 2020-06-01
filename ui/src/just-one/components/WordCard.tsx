import React from 'react';
import { Trans } from 'react-i18next';
import i18n from '../../i18n';
import { Grid, Paper, Typography } from '@material-ui/core';

import { createStyles, withStyles, WithStyles, Theme } from '@material-ui/core/styles';
import { STYLES } from '../../theme';
import WordHintInput from './WordHintInput';

const styles = (theme: Theme) => createStyles({
    root: {
        ...STYLES.flexCenter,
        width: '100%',
    },
    wordCard: {
        ...STYLES.flexCenter,
        height: 220,
        maxHeight: '30vh',
        minHeight: 150,
        fontSize: 32,
        border: '2px solid black',
        whiteSpace: 'nowrap',
        position: 'relative',
    }, 
    guess: {
        ...STYLES.handwriting
    },
    correct: {
        borderColor: theme.palette.success.main
    },
    wrong: {
        borderColor: theme.palette.error.main
    }, 
    authorTag: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        margin: 8,
    },
    origWordTag: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        fontSize: 16,
        lineHeight: 1,
        margin: 8,
        whiteSpace: 'normal',
    },
    small: {
        maxWidth: 250,
        height: 125,
        fontSize: 24,
        flex: '1 1 auto',
    }
});


type WordCardProps = {
	word: string;
	guesser?: string;
	color?: string;
    isGuesser?: boolean;
    guess?: string;
    guessedRight?: boolean;
    showInput?: boolean;
    small?: boolean;
    submitHint?: (hint:string)=>void
}&WithStyles<typeof styles>;

class WordCard extends React.Component<WordCardProps> {

    render() {
        const { word, guesser, color, isGuesser, guess, guessedRight, showInput, submitHint, small, classes} = this.props;
        const cardStyle = {borderColor: color};
        const guesserName = guesser;
        let guesserText;
        let originalWord;
        if (guess) {
            originalWord = i18n.t('GAME.COMMON.WORD', 'Begriff') + ': ' + word;
        } else if (guesser) {
            guesserText = <Trans i18nKey="GAME.COMMON.TURN_GUESSING" tOptions={{context: (isGuesser ? 'ME' : '')}}>{{guesserName}} muss raten</Trans>;
        }
        const classList = [classes.wordCard];
        if (guess) {
            delete cardStyle.borderColor;
            if (guessedRight) {
                classList.push(classes.correct);
            } else {
                classList.push(classes.wrong);
            }
        }
        if (small) classList.push(classes.small);

        return (
            <Grid item xs={12} className={small ? classes.root : undefined}>
    	        <Paper className={classList.join(' ')} style={cardStyle}>
    	        	{
                        (showInput && submitHint) ? 
                        <WordHintInput submitHint={submitHint} label={i18n.t('GAME.COMMON.GUESS', 'Rateversuch')}/> : 
                        <span className={guess && classes.guess} style={{color: guess && color}}>{guess || word}</span>
                    }
                    {guesserText && <Typography variant="caption" className={classes.authorTag} style={{color: color}}>{guesserText}</Typography>}
                    {originalWord && <span className={classes.origWordTag}>{originalWord}</span>}
    	        </Paper>
            </Grid>
        );
    }

}

export default withStyles(styles)(WordCard);