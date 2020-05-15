import React from 'react';
import { PencilAnimation } from './PencilAnimation';

type WordHintProps = {
	hint?: string,
	color?: string,
	duplicate?: boolean,
  author?: string
}

export class WordHint extends React.Component<WordHintProps> {

  render() {
  	const currentHint = this.props.hint;
    const color = this.props.color;
    const styleObj = {
    	'color': color,
    	'textDecoration': this.props.duplicate ? 'line-through' : 'none'
    };
    const author = this.props.author;

    return (
	    <div className="Word-hint" style={styleObj}>
        {currentHint || <PencilAnimation color={color}></PencilAnimation>}
        {author && <span className="Author-tag">{author}</span>}
      </div>
    );
  }

}