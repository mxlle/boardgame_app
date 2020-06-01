import React from 'react';
import { IconButton, Box } from '@material-ui/core';
import { createStyles, withStyles, WithStyles, Theme } from '@material-ui/core/styles';
import CheckIcon from '@material-ui/icons/Check';

export const allColors: string[] = [
    '#e51235',
    '#d81b60',
    '#8e24aa',
    '#6e45c1',
    '#4959cc',
    '#1e88e5',
    '#039be5',
    '#00acc1',
    '#00897b',
    '#43a047',
    '#7cb342',
    '#c0ca33',
    '#ffc215',
    '#ffab00',
    '#ff6d00',
    '#f4511e'
];

export function getRandomColor(color?: string|null): string {
    if (!color || !allColors.includes(color)) {
        return allColors[Math.floor(Math.random()*allColors.length)];
    } else {
        return color;
    }
}

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