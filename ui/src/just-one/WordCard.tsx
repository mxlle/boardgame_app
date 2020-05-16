import React from 'react';

type WordCardProps = {
	word: string;
	guesser?: string;
	color?: string;
  guess?: string;
  guessedRight?: boolean;
}

export class WordCard extends React.Component<WordCardProps> {

  render() {
  	const currentWord = this.props.word;
    const guesser = this.props.guesser;
    let guesserText = '';
    if (guesser) {
      guesserText = this.props.guess ? (guesser + '\'s Rateversuch: ' + this.props.guess) : (guesser + ' muss raten');
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
	    <div className={classes.join(' ')}>
	    	<span>{currentWord}</span>
        {guesserText && <span className="Author-tag" style={{color: this.props.color}}>{guesserText}</span>}
	    </div>
    );
  }

}