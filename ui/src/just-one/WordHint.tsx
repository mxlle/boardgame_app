import React from 'react';
import { WordHintInput } from './WordHintInput';
import { PencilAnimation } from './PencilAnimation';
import { Done as DoneIcon } from '@material-ui/icons';

type WordHintProps = {
	hint?: string,
	color?: string,
	duplicate?: boolean,
  author?: string,
  showPencil?: boolean,
  showCheck?: boolean,
  showInput?: boolean,
  submitHint?: (hint:string)=>void
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
    const showCheck = this.props.showCheck;

    const classes = ['Word-hint'];
    if (this.props.duplicate) classes.push('Word-hint-duplicate');
    if (currentHint && currentHint.length > 20) classes.push('Word-hint-huge');
    else if (currentHint && currentHint.length > 14) classes.push('Word-hint-long');
    const extraClasses = classes.join(' ');

    if (this.props.showInput && this.props.submitHint) {
      return (
        <div className={extraClasses} style={styleObj}>
          <WordHintInput submitHint={this.props.submitHint}/>
          {author && <span className="Author-tag">{author}</span>}
        </div>
      );
    } else {
      return (
        <div className={extraClasses} style={styleObj}>
          {!showCheck && currentHint}
          {showCheck && <DoneIcon className="Done-icon"></DoneIcon>}
          {showPencil && <PencilAnimation color={color}></PencilAnimation>}
          {author && <span className="Author-tag">{author}</span>}
        </div>
      );
    }

    
  }

}