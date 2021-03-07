import React from 'react';
import { createStyles, withStyles, WithStyles, Theme } from '@material-ui/core/styles';
import { STYLES } from '../../theme';
import WordHintInput from './WordHintInput';
import CornerInfo from '../../common/CornerInfo';
import PencilAnimation from '../../common/PencilAnimation';
import { Grid, Paper, Box } from '@material-ui/core';

const styles = (theme: Theme) => createStyles({
    root: { 
        ...STYLES.flexCenter,
        minHeight: 80,
        fontSize: 48,
        border: '2px solid black',
        position: 'relative',
        padding: theme.spacing(1, 4, 1, 4)
    },
    writing: {
        borderStyle: 'dotted',
    },
    word: {
        ...STYLES.handwriting,
        lineHeight: 1.2,
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
    addon: {
        position: 'absolute',
        right: theme.spacing(2),
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
    defaultValue?: string
}&WithStyles<typeof styles>;

class WordHint extends React.Component<WordHintProps> {

    render() {
        const { hint, color, author, 
                showPencil, showCheck, showCross, 
                submitHint, duplicate, defaultValue,
                classes, children
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
            const hintClasses = ['notranslate', classes.word];
            if (hint && hint.length > 16) hintClasses.push(classes.hugeWord);
            else if (hint && hint.length > 10) hintClasses.push(classes.longWord);
            if (duplicate) hintClasses.push(classes.lineThrough);

            content = <Box className={hintClasses.join(' ')}>{hint}</Box>;
        }

        return (
            <Grid item xs={12}>
                <Paper className={classList.join(' ')} style={duplicate?undefined:styleObj}>
                    {content}
                    {showPencil && <PencilAnimation color={color} />}
                    {children && <Box className={classes.addon}>{children}</Box>}
                    <CornerInfo bottom left handwriting color={color}>{author}</CornerInfo>
                </Paper>
            </Grid>
        );     
    }
}

export default withStyles(styles)(WordHint);
