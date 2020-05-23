import React from 'react';
import { WordHintInput } from './WordHintInput';
import { PencilAnimation } from '../../common/PencilAnimation';
import { Checkbox, Paper } from '@material-ui/core';
import { Mood as MoodIcon, MoodBad as MoodBadIcon } from '@material-ui/icons';

type WordHintProps = {
	hint?: string,
	color?: string,
	duplicate?: boolean,
    author?: string,
    showPencil?: boolean,
    showCheck?: boolean,
    showCross?: boolean,
    showInput?: boolean,
    submitHint?: (hint:string)=>void,
    showDuplicateToggle?: boolean,
    toggleDuplicate?: ()=>void
}

export class WordHint extends React.Component<WordHintProps> {

    render() {
        const { hint, color, author, 
                showPencil, showCheck, showCross, 
                showInput, submitHint,
                showDuplicateToggle, toggleDuplicate, duplicate 
        } = this.props;
        const styleObj = {
        	'color': color,
            'borderColor': color
        };
        const doShowPencil = showPencil || !this.props.hint;
        const isDuplicate = duplicate || false;

        const classes = ['Word-hint'];
        if (doShowPencil) classes.push('Word-hint-writing');
        if (isDuplicate) classes.push('Word-hint-duplicate');
        if (showCross) classes.push('Word-hint-showCross');
        if (hint && hint.length > 20) classes.push('Word-hint-huge');
        else if (hint && hint.length > 14) classes.push('Word-hint-long');
        const extraClasses = classes.join(' ');

        if (showInput && submitHint) {
            return (
                <Paper className={extraClasses} style={styleObj}>
                    <WordHintInput submitHint={submitHint}/>
                    {author && <span className="Author-tag">{author}</span>}
                </Paper>
            );
        } else {
            return (
                <Paper className={extraClasses} style={isDuplicate?undefined:styleObj}>
                    {!showCheck && !showCross && hint}
                    {showCheck && !showCross && <span className="Done-icon">✓</span>}
                    {showCross && <span className="Invalid-icon">✗</span>}
                    {doShowPencil && <PencilAnimation color={color}></PencilAnimation>}
                    {showDuplicateToggle && toggleDuplicate && (
                        <Checkbox className="Duplicate-toggle" 
                            icon={<MoodIcon />} checkedIcon={<MoodBadIcon />} 
                            checked={isDuplicate}
                            onChange={()=>toggleDuplicate()}/>
                    )}
                    {author && <span className="Author-tag" style={styleObj}>{author}</span>}
                </Paper>
            );
        }

        
    }

}