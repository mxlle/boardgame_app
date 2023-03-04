import React from 'react';
import {Box, IconButton} from '@material-ui/core';
import {createStyles, Theme, WithStyles, withStyles} from '@material-ui/core/styles';
import CheckIcon from '@material-ui/icons/Check';
import {allColors} from "../shared/color-util";

const BTN_SIZE = 32;
const ICON_SIZE = 24;

const styles = (theme: Theme) => createStyles({
    root: {
        margin: theme.spacing(4),
        width: 4*BTN_SIZE
    },
    button: {
        margin: 0,
        borderRadius: 0,
        color: 'white',
    }
});

type ColorPickerProps = {
	selected?: string;
    select: (color: string)=>void;
}&WithStyles<typeof styles>;

class ColorPicker extends React.Component<ColorPickerProps> {

    render() {
    	const { selected, select, classes } = this.props;

        const colorButtons = allColors.map((color: string) => {
            const isSelected = selected === color;
            const padding = isSelected ? BTN_SIZE/2-ICON_SIZE/2 : BTN_SIZE/2;
            const style = {
                backgroundColor: color,
                padding: padding
            };
            return (
                <IconButton className={classes.button} onClick={() => select(color)} style={style} key={color}>
                    {isSelected && <CheckIcon/>}
                </IconButton>
            )
        });

        return (
            <Box className={classes.root}>
                { colorButtons }
            </Box>
        );
    }

}

export default withStyles(styles)(ColorPicker);
