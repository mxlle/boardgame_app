import React from 'react';
import { Trans } from 'react-i18next';
import i18n from '../../i18n';
import {Box, Grid, Paper} from '@material-ui/core';

import { createStyles, withStyles, WithStyles, Theme } from '@material-ui/core/styles';
import { STYLES } from '../../theme';
import WordHintInput from './WordHintInput';
import CornerInfo from '../../common/CornerInfo';
import {IUser} from "../../types";
import PencilAnimation from "../../common/PencilAnimation";

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
        border: `2px solid ${theme.palette.text.primary}`,
        whiteSpace: 'nowrap',
        position: 'relative',
        padding: theme.spacing(0, 5)
    }, 
    guess: {
        ...STYLES.handwriting
    },
    wrong: {
        '& $guess': {
            textDecoration: 'line-through'
        }
    }, 
    small: {
        maxWidth: 250,
        height: 125,
        fontSize: 24,
        flex: '1 1 auto',
    },
    smallPencil: {
        transform: 'scale(0.5) translateY(-0.5rem)',
        height: 32
    }
});


type WordCardProps = {
	word: string;
	guesser?: IUser;
    isGuesser?: boolean;
    guess?: string;
    guessedRight?: boolean|null;
    isGuessingPhase?: boolean;
    small?: boolean;
    submitGuess?: (hint:string)=>void
}&WithStyles<typeof styles>;

class WordCard extends React.Component<WordCardProps> {

    render() {
        const { word, guesser, isGuesser, guess, guessedRight, isGuessingPhase, submitGuess, small, classes} = this.props;

        const classList = [classes.wordCard];
        const cardStyle = {borderColor: guesser?.color};
        let guesserInfo: React.ReactElement[], originalWord;
        guesserInfo = [<span>{guesser?.name}</span>];
        
        if (guess) {
            originalWord = i18n.t('GAME.COMMON.WORD', 'Begriff') + ': ' + word;
            if (!guessedRight) classList.push(classes.wrong);
        } else if (guesser && guesser.name) {
            guesserInfo = [<Trans i18nKey="GAME.COMMON.TURN_GUESSING" tOptions={{context: (isGuesser ? 'ME' : '')}} key="name">{{guesser: guesser.name}} muss raten</Trans>];
            if (!!isGuessingPhase && !isGuesser) {
                guesserInfo.push(<Box className={classes.smallPencil}><PencilAnimation color={guesser?.color} key="pencil"/></Box>);
            }
        }
        if (small) classList.push(classes.small);
        if (submitGuess) classList.push('WordCard-withInput');

        return (
            <Grid item xs={12} className={small ? classes.root : undefined}>
    	        <Paper className={classList.join(' ')} style={cardStyle}>
    	        	{
                        (submitGuess) ?
                        <WordHintInput submitHint={submitGuess} label={i18n.t('GAME.COMMON.GUESS', 'Rateversuch')}/> :
                        <span className={guess && classes.guess} style={{color: (guess) ? guesser?.color : undefined}}>{guess || word}</span>
                    }
                    <CornerInfo bottom left handwriting color={guesser?.color} m={2}>
                        {guesserInfo}
                    </CornerInfo>
                    <CornerInfo bottom right m={2}>{originalWord}</CornerInfo>
    	        </Paper>
            </Grid>
        );
    }

}

export default withStyles(styles)(WordCard);
