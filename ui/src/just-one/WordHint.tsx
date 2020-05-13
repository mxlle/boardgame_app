import React from 'react';

type WordHintProps = {
	hint: string
}

export class WordHint extends React.Component<WordHintProps> {

  render() {
  	const currentHint = this.props.hint;

    return (
	    <div className="Word-hint">{currentHint}</div>
    );
  }

}