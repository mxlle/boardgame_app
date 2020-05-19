import React from 'react';
import { WordHintInput } from './WordHintInput';
import { PencilAnimation } from '../common/PencilAnimation';
import { Checkbox, Paper } from '@material-ui/core';
import { Mood as MoodIcon, MoodBad as MoodBadIcon } from '@material-ui/icons';

type WordHintProps = {
	hint?: string,
	color?: string,
	duplicate?: boolean,
  author?: string,
  showPencil?: boolean,
  showCheck?: boolean,
  showInput?: boolean,
  submitHint?: (hint:string)=>void,
  showDuplicateToggle?: boolean,
  toggleDuplicate?: ()=>void
}

export class WordHint extends React.Component<WordHintProps> {

  render() {
  	const currentHint = this.props.hint;
    const color = this.props.color;
    const styleObj = {
    	'color': color,
      'borderColor': color
    };
    const author = this.props.author;
    const showPencil = this.props.showPencil || !this.props.hint;
    const showCheck = this.props.showCheck;
    const showDuplicateToggle = this.props.showDuplicateToggle;
    const toggleDuplicate = this.props.toggleDuplicate;

    const classes = ['Word-hint'];
    if (showPencil) classes.push('Word-hint-writing');
    if (this.props.duplicate) classes.push('Word-hint-duplicate');
    if (currentHint && currentHint.length > 20) classes.push('Word-hint-huge');
    else if (currentHint && currentHint.length > 14) classes.push('Word-hint-long');
    const extraClasses = classes.join(' ');

    if (this.props.showInput && this.props.submitHint) {
      return (
        <Paper className={extraClasses} style={styleObj}>
          <WordHintInput submitHint={this.props.submitHint}/>
          {author && <span className="Author-tag">{author}</span>}
        </Paper>
      );
    } else {
      return (
        <Paper className={extraClasses} style={styleObj}>
          {!showCheck && currentHint}
          {showCheck && <span className="Done-icon">✓</span>}
          {showPencil && <PencilAnimation color={color}></PencilAnimation>}
          {showDuplicateToggle && toggleDuplicate && (
            <Checkbox className="Duplicate-toggle" 
              icon={<MoodIcon />} checkedIcon={<MoodBadIcon />} 
              checked={this.props.duplicate}
              onChange={()=>toggleDuplicate()}/>
          )}
          {author && <span className="Author-tag">{author}</span>}
        </Paper>
      );
    }

    
  }

}