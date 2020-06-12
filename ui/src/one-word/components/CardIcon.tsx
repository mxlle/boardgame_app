import React from "react";
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import {Theme, Tooltip, withStyles, createStyles, WithStyles} from "@material-ui/core";

export enum CardTypes {
    DEFAULT = 'default',
    CORRECT = 'correct',
    WRONG = 'wrong'
}

type CardIconProps = {
    type?: CardTypes;
    title?: string;
} & WithStyles<typeof styles>;

const styles = (theme: Theme) => createStyles({
    root: {
        display: 'inline-flex',
        alignItems: 'center',
        border: '2px solid currentColor',
        borderRadius: 5,
        padding: '0 .5ex 0 .25ex',
        margin: '.25ex .5ex',
        verticalAlign: 'middle',
        cursor: 'default',
    },
    correct: {
        color: theme.palette.success.main,
    },
    wrong: {
        color: theme.palette.error.main,
    }
});

class CardIcon extends React.Component<CardIconProps> {
    render() {
        const { type, title, children, classes } = this.props;

        const rootClasses = [classes.root];

        if (type === CardTypes.CORRECT) rootClasses.push(classes.correct);
        if (type === CardTypes.WRONG) rootClasses.push(classes.wrong);

        let result = (
            <div className={rootClasses.join(' ')}>
                {type === CardTypes.CORRECT && <CheckIcon fontSize="inherit"/>}
                {type === CardTypes.WRONG && <ClearIcon fontSize="inherit"/>}
                <div>{children}</div>
            </div>
        );

        if (title) {
            result = <Tooltip title={title} aria-label={title}>{result}</Tooltip>;
        }

        return result;
    }
}

export default withStyles(styles)(CardIcon);
