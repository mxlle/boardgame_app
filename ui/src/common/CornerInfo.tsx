import React from 'react';
import { Box } from '@material-ui/core';
import { createStyles, withStyles, WithStyles, Theme } from '@material-ui/core/styles';
import { STYLES } from '../theme';

const styles = (theme: Theme) => createStyles({
    root: {
        position: 'absolute',
        whiteSpace: 'normal',
        fontSize: '1.2rem',
        lineHeight: 1
    }, 
    top: {
        top: 0
    }, 
    bottom: {
        bottom: 0
    }, 
    left: {
        left: 0
    }, 
    right: {
        right: 0
    },
    handwriting: {
        ...STYLES.handwriting
    }
});

type CornerInfoProps = {
	children?: React.ReactElement|React.ReactElement[]|string,
    top?: boolean,
    bottom?: boolean,
    left?: boolean,
    right?: boolean,
    handwriting?: boolean,
    color?: string,
    m?: number,
}&WithStyles<typeof styles>;

class CornerInfo extends React.Component<CornerInfoProps> {

    render() {
    	const { children, top, bottom, left, right, handwriting, color, m, classes } = this.props;
        if (!children) return null;

        const classList = [classes.root];
        if (top) classList.push(classes.top);
        if (bottom) classList.push(classes.bottom);
        if (left) classList.push(classes.left);
        if (right) classList.push(classes.right);
        if (handwriting) classList.push(classes.handwriting);

        return (
            <Box m={m||1} className={classList.join(' ')} style={{ color: color }}>
                {children}
            </Box>
        );
    }

}

export default withStyles(styles)(CornerInfo);