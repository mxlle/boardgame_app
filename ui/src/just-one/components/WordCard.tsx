import React from 'react';
import { Trans } from 'react-i18next';
import i18n from '../../i18n';
import { Grid, Paper } from '@material-ui/core';
import { WordHintInput } from './WordHintInput';

type WordCardProps = {
	word: string;
	guesser?: string;
	color?: string;
    isGuesser?: boolean;
    guess?: string;
    guessedRight?: boolean;
    showInput?: boolean;
    submitHint?: (hint:string)=>void
}

export class WordCard extends React.Component<WordCardProps> {

    render() {
        const { word, guesser, color, isGuesser, guess, guessedRight, showInput, submitHint} = this.props
        const guesserName = guesser;
        let guesserText;
        let originalWord;
        if (guess) {
            originalWord = i18n.t('GAME.COMMON.WORD', 'Begriff') + ': ' + word;
        } else if (guesser) {
            guesserText = <Trans i18nKey="GAME.COMMON.TURN_GUESSING" tOptions={{context: (isGuesser ? 'ME' : '')}}>{{guesserName}} muss raten</Trans>;
        }
        const classes = ['Word-card'];
        if (guess) {
            classes.push('Word-card-guess');
            if (guessedRight) {
                classes.push('Word-card-correct');
            } else {
                classes.push('Word-card-wrong');
            }
        }

        return (
            <Grid item xs={12} className="Word-card-wrapper">
    	        <Paper className={classes.join(' ')} style={{borderColor: color}}>
    	        	{
                        (showInput && submitHint) ? 
                        <WordHintInput submitHint={submitHint} label={i18n.t('GAME.COMMON.GUESS', 'Rateversuch')}/> : 
                        <span className="Word" style={{color: guess && color}}>{guess || word}</span>
                    }
                    {guesserText && <span className="Author-tag" style={{color: color}}>{guesserText}</span>}
                    {originalWord && <span className="Orig-word-tag">{originalWord}</span>}
    	        </Paper>
            </Grid>
        );
    }

}