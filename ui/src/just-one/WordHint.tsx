import React from 'react';

type WordHintProps = {
	hint: string,
	color?: string,
	duplicate?: boolean
}

export class WordHint extends React.Component<WordHintProps> {

  render() {
  	const currentHint = this.props.hint;
    const styleObj = {
    	'color': this.props.color,
    	'textDecoration': this.props.duplicate ? 'line-through' : 'none'
    }

    return (
	    <div className="Word-hint" style={styleObj}>{currentHint}</div>
    );
  }

}