import React from 'react';

type WordCardProps = {
	word: string;
	guesser?: string;
	color?: string;
}

export class WordCard extends React.Component<WordCardProps> {

  render() {
  	const currentWord = this.props.word;
    const guesser = this.props.guesser;

    return (
	    <div className="Word-card">
	    	{currentWord}
        	{guesser && <span className="Author-tag" style={{color: this.props.color}}>{guesser} muss raten</span>}
	    </div>
    );
  }

}