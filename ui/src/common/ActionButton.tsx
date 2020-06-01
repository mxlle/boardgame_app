import React from 'react';
import { createStyles, withStyles, WithStyles, Theme } from '@material-ui/core/styles';
import { CircularProgress } from '@material-ui/core';

const progressSize = 24;

const styles = (theme: Theme) => createStyles({
    root: {
        position: 'relative',
    }, 
    progress: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -progressSize/2,
        marginLeft: -progressSize/2,
    }
});

type ActionButtonProps = {
	loading: boolean;
    children: React.ReactNode
}&WithStyles<typeof styles>;

class ActionButton extends React.Component<ActionButtonProps> {

    render() {
    	const { children, loading, classes } = this.props;

        return (
            <div className={classes.root}>
                { children }
                { loading && <CircularProgress size={progressSize} className={classes.progress} /> }
            </div>
        );
    }

}

export default withStyles(styles)(ActionButton);