import React from 'react';
import { PencilAnimation } from './PencilAnimation';

type WordHintProps = {
	hint?: string,
	color?: string,
	duplicate?: boolean,
  author?: string,
  showPencil?: boolean
}

export class WordHint extends React.Component<WordHintProps> {

  render() {
  	const currentHint = this.props.hint;
    const color = this.props.color;
    const styleObj = {
    	'color': color
    };
    const author = this.props.author;
    const showPencil = this.props.showPencil || !this.props.hint;

    const classes = ['Word-hint'];
    if (this.props.duplicate) classes.push('Word-hint-duplicate');
    if (currentHint && currentHint.length > 20) classes.push('Word-hint-huge');
    else if (currentHint && currentHint.length > 14) classes.push('Word-hint-long');
    const extraClasses = classes.join(' ');

    return (
	    <div className={extraClasses} style={styleObj}>
        {currentHint}
        {showPencil && <PencilAnimation color={color}></PencilAnimation>}
        {author && <span className="Author-tag">{author}</span>}
      </div>
    );
  }

}