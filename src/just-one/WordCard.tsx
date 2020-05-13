import React from 'react';

type WordCardProps = {
	word: string
}

export class WordCard extends React.Component<WordCardProps> {

  render() {
  	const currentWord = this.props.word;

    return (
	    <div className="Word-card">{currentWord}</div>
    );
  }

}