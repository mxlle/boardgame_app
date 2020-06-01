import React from 'react';
import { createStyles, withStyles, WithStyles, Theme } from '@material-ui/core/styles';
import { STYLES } from '../../theme';
import WordHintInput from './WordHintInput';
import PencilAnimation from '../../common/PencilAnimation';
import { Grid, Checkbox, Paper, Typography, Box } from '@material-ui/core';
import { Mood as MoodIcon, MoodBad as MoodBadIcon } from '@material-ui/icons';

const styles = (theme: Theme) => createStyles({
    root: { 
        ...STYLES.flexCenter,
        height: 100,
        fontSize: 48,
        border: '2px solid black',
        whiteSpace: 'nowrap',
        position: 'relative',
    },
    writing: {
        borderStyle: 'dotted',
    },
    longWord: {
        fontSize: 32,
    }, 
    hugeWord: {
        fontSize: 24,
    },
    duplicate: {
        borderStyle: 'dashed',
        color: '#aaaaaa', // TODO
        borderColor: '#aaaaaa', // TODO
    },
    lineThrough: {
        textDecoration: 'line-through',
    },
    authorTag: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        margin: 8,
    },
    toggleBtn: {
        position: 'absolute',
        right: 8, 
        zIndex: 1,
    },
});

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
}&WithStyles<typeof styles>;

class WordHint extends React.Component<WordHintProps> {

    render() {
        const { hint, color, author, 
                showPencil, showCheck, showCross, 
                showInput, submitHint,
                showDuplicateToggle, toggleDuplicate, duplicate,
                classes
        } = this.props;

        const styleObj = {
        	'color': color,
            'borderColor': color
        };

        const classList = [classes.root];

        if (showInput && submitHint) {
            return (
                <Grid item xs={12}>
                    <Paper className={classList.join(' ')} style={styleObj}>
                        <WordHintInput submitHint={submitHint}/>
                        {author && <Typography variant="caption" className={classes.authorTag}>{author}</Typography>}
                    </Paper>
                </Grid>
            );
        } else {
            const doShowPencil = showPencil || !this.props.hint;
            const isDuplicate = duplicate || false;
            if (doShowPencil) classList.push(classes.writing);
            if (isDuplicate) classList.push(classes.duplicate);
            
            let content;
            if (showCross) {
                content = <Box fontSize={80}>✗</Box>;
            } else if (showCheck) {
                content = <Box fontSize={80}>✓</Box>;
            } else {
                const hintClasses = [];
                if (hint && hint.length > 18) hintClasses.push(classes.hugeWord);
                else if (hint && hint.length > 12) hintClasses.push(classes.longWord);
                if (isDuplicate) hintClasses.push(classes.lineThrough);

                content = <Typography variant="h2" className={hintClasses.join(' ')}>{hint}</Typography>;
            }

            return (
                <Grid item xs={12}>
                    <Paper className={classList.join(' ')} style={isDuplicate?undefined:styleObj}>
                        {content}
                        {doShowPencil && <PencilAnimation color={color}></PencilAnimation>}
                        {showDuplicateToggle && toggleDuplicate && (
                            <Checkbox className={classes.toggleBtn} 
                                icon={<MoodIcon />} checkedIcon={<MoodBadIcon />} 
                                checked={isDuplicate}
                                onChange={()=>toggleDuplicate()}/>
                        )}
                        {author && <Typography variant="caption" className={classes.authorTag} style={styleObj}>{author}</Typography>}
                    </Paper>
                </Grid>
            );
        }      
    }
}

export default withStyles(styles)(WordHint);