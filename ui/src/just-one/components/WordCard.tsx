import React from 'react';
import { Trans } from 'react-i18next';
import i18n from '../../i18n';
import { Paper } from '@material-ui/core';
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
        if (guesser) {
            if (guess) {
                guesserText = <Trans i18nKey="GAME.COMMON.CURRENT_GUESS" tOptions={{context: (isGuesser ? 'ME' : '')}}>{{guesserName}}s    Rateversuch: {{guess}}</Trans>;
            } else {
                guesserText = <Trans i18nKey="GAME.COMMON.TURN_GUESSING" tOptions={{context: (isGuesser ? 'ME' : '')}}>{{guesserName}} muss raten</Trans>;
            }
        } else if (guess) {
            guesserText = <Trans i18nKey="GAME.COMMON.GUESS_SPEC">Rateversuch: {{guess}}</Trans>;
        }
        const classes = ['Word-card'];
        if (guess) {
            if (guessedRight) {
                classes.push('Word-card-correct');
            } else {
                classes.push('Word-card-wrong');
            }
        }

        return (
	        <Paper className={classes.join(' ')} style={{borderColor: color}}>
	        	{
                    (showInput && submitHint) ? 
                    <WordHintInput submitHint={submitHint} label={i18n.t('GAME.COMMON.GUESS', 'Rateversuch')}/> : 
                    <span>{word}</span>
                }
                {guesserText && <span className="Author-tag" style={{color: color}}>{guesserText}</span>}
	        </Paper>
        );
    }

}