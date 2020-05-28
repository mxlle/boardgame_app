import React from 'react';
import { createStyles, withStyles, WithStyles, Theme } from '@material-ui/core/styles';

const PENCIL_WIDTH = 12;
const PENCIL_LENGTH =  4*PENCIL_WIDTH;
const PENCIL_NIB = 1;

const styles = (theme: Theme) => createStyles({
    pencil: { 
        width: PENCIL_WIDTH,
        marginLeft: PENCIL_LENGTH/2,
        transform: 'rotate(35deg)',
        animation: '$pencil .5s forwards',
        animationIterationCount: 'infinite',
    },
    body: {
        width: PENCIL_WIDTH,
        height: PENCIL_LENGTH,
        backgroundColor: 'black',
        borderTopLeftRadius: PENCIL_WIDTH/4,
        borderTopRightRadius: PENCIL_WIDTH/4,
    },
    nib: {
        width: 2*PENCIL_NIB,
        height: 0,
        borderTop: `${PENCIL_WIDTH}px solid black`,
        borderLeft: `${ PENCIL_WIDTH/2 - PENCIL_NIB }px solid transparent`,
        borderRight: `${ PENCIL_WIDTH/2 - PENCIL_NIB }px solid transparent`,
    },
    '@keyframes pencil': {
        '0%': {transform: 'rotate(35deg)'},
        '50%': {transform: 'rotateZ(25deg)'},
        '100%': {transform: 'rotateZ(35deg)'},
    }
});

interface PencilAnimationProps extends WithStyles<typeof styles> {
	color?: string,
}

class PencilAnimation extends React.Component<PencilAnimationProps> {

    render() {
        const { color, classes } = this.props;

        const styleObj1 = {
        	backgroundColor: color,
        };
        const styleObj2 = {
        	borderTopColor: color,
        };

        return (
	        <div className={classes.pencil}>
                <div className={classes.body} style={styleObj1}></div>
                <div className={classes.nib} style={styleObj2}></div>
            </div>
        );
    }
}

export default withStyles(styles)(PencilAnimation);