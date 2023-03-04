import React from 'react';
import {createStyles, Theme, WithStyles, withStyles} from '@material-ui/core/styles';
import {allColors} from "../shared/color-util";

const styles = (theme: Theme) => createStyles({
    root: {
        width: '100%',
        height: theme.spacing(3),
        position: 'relative',
        backgroundColor: theme.palette.type === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
    },
    bar: {
        height: '100%',
        position: 'absolute',
        backgroundColor: theme.palette.primary.main,
    }
});

type ProgressBarProps = {
    value: number;
    colors?: string[];
    className?: string;
}&WithStyles<typeof styles>;

class ProgressBar extends React.Component<ProgressBarProps> {

    render() {
        const { value, colors, className, classes } = this.props;
        let classNames = [classes.root];
        if (className) classNames.push(className);

        const barStyle: React.CSSProperties = { width: value + '%' };
        if (colors) {
            const sortedColors = allColors.filter(c => colors.includes(c));
            barStyle.background = `linear-gradient(to right, ${sortedColors.join(',')})`;
        }

        return (
            <div className={classNames.join(' ')}>
                <div className={classes.bar} style={barStyle}/>
            </div>
        );
    }

}

export default withStyles(styles)(ProgressBar);
