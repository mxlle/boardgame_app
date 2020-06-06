import React from 'react';
import { createStyles, withStyles, WithStyles, Theme } from '@material-ui/core/styles';
import { STYLES } from '../../theme';
import WordHintInput from './WordHintInput';
import CornerInfo from '../../common/CornerInfo';
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
        color: theme.palette.grey.A200,
        borderColor: theme.palette.grey.A200,
    },
    lineThrough: {
        textDecoration: 'line-through',
    },
    toggleBtn: {
        position: 'absolute',
        right: theme.spacing(1), 
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
    submitHint?: (hint:string)=>void,
    toggleDuplicate?: ()=>void,
    defaultValue?: string
}&WithStyles<typeof styles>;

class WordHint extends React.Component<WordHintProps> {

    render() {
        const { hint, color, author, 
                showPencil, showCheck, showCross, 
                submitHint, toggleDuplicate, duplicate, defaultValue,
                classes
        } = this.props;

        const styleObj = {
        	'color': color,
            'borderColor': color
        };

        const classList = [classes.root];
        if (showPencil) classList.push(classes.writing);
        if (duplicate) classList.push(classes.duplicate);
        if (submitHint) classList.push('WordHint-withInput');
        
        let content;
        if (submitHint) {
            content = <WordHintInput submitHint={submitHint} defaultValue={defaultValue}/>;
        } else if (showCross) {
            content = <Box fontSize={80}>✗</Box>;
        } else if (showCheck) {
            content = <Box fontSize={80}>✓</Box>;
        } else {
            const hintClasses = [];
            if (hint && hint.length > 18) hintClasses.push(classes.hugeWord);
            else if (hint && hint.length > 12) hintClasses.push(classes.longWord);
            if (duplicate) hintClasses.push(classes.lineThrough);

            content = <Typography variant="h2" className={hintClasses.join(' ')}>{hint}</Typography>;
        }

        return (
            <Grid item xs={12}>
                <Paper className={classList.join(' ')} style={duplicate?undefined:styleObj}>
                    {content}
                    {showPencil && <PencilAnimation color={color} />}
                    {toggleDuplicate && (
                        <Checkbox className={classes.toggleBtn} 
                            icon={<MoodIcon />} checkedIcon={<MoodBadIcon />} 
                            checked={duplicate || false}
                            onChange={()=>toggleDuplicate()}/>
                    )}
                    <CornerInfo bottom left handwriting color={color}>{author}</CornerInfo>
                </Paper>
            </Grid>
        );     
    }
}

export default withStyles(styles)(WordHint);