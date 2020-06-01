import React from 'react';
import { createStyles, withStyles, WithStyles, Theme } from '@material-ui/core/styles';
import {CircularProgress, Paper} from '@material-ui/core';
import {STYLES} from "../theme";

const styles = (theme: Theme) => createStyles({
    root: {
        ...STYLES.flexCenter
    }
});

type LoaderProps = {
    className?: string
}&WithStyles<typeof styles>;

class Loader extends React.Component<LoaderProps> {

    render() {
        const { className, classes } = this.props;

        return (
            <Paper square elevation={0} className={`${classes.root} ${className}`}>
                <CircularProgress />
            </Paper>
        );
    }

}

export default withStyles(styles)(Loader);