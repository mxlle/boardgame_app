import React from 'react';

type WordHintProps = {
	hint: string,
	color?: string
}

export class WordHint extends React.Component<WordHintProps> {

  render() {
  	const currentHint = this.props.hint;
  	const color = this.props.color;

    return (
	    <div className="Word-hint" style={{color: color}}>{currentHint}</div>
    );
  }

}