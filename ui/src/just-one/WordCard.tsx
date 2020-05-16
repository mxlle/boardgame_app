import React from 'react';
import { WordHintInput } from './WordHintInput';

type WordCardProps = {
	word: string;
	guesser?: string;
	color?: string;
  guess?: string;
  guessedRight?: boolean;
  showInput?: boolean;
  submitHint?: (hint:string)=>void
}

export class WordCard extends React.Component<WordCardProps> {

  render() {
  	const currentWord = this.props.word;
    const guesser = this.props.guesser;
    let guesserText = '';
    if (guesser) {
      if (this.props.guess) {
        guesserText = (guesser.toLowerCase() === 'ich' ? 'Mein ' : (guesser + '\'s ')) + 'Rateversuch: ' + this.props.guess;
      } else {
        guesserText = guesser + ' muss raten';
      }
    } else if (this.props.guess) {
      guesserText = 'Rateversuch: ' + this.props.guess;
    }
    const classes = ['Word-card'];
    if (this.props.guess) {
      if (this.props.guessedRight) {
        classes.push('Word-card-correct');
      } else {
        classes.push('Word-card-wrong');
      }
    }

    return (
	    <div className={classes.join(' ')} style={{borderColor: this.props.color}}>
	    	{
          (this.props.showInput && this.props.submitHint) ? 
          <WordHintInput submitHint={this.props.submitHint} label="Rateversuch"/> : 
          <span>{currentWord}</span>
        }
        {guesserText && <span className="Author-tag" style={{color: this.props.color}}>{guesserText}</span>}
	    </div>
    );
  }

}