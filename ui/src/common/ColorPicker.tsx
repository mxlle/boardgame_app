import React from 'react';
import { IconButton, Box } from '@material-ui/core';
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

type ColorPickerProps = {
	selected?: string;
    select: (color: string)=>void;
}

const BTN_SIZE = 32;
const ICON_SIZE = 24;

export class ColorPicker extends React.Component<ColorPickerProps> {

    render() {
    	const { selected, select } = this.props;

        const colorButtons = allColors.map((color: string) => {
            const isSelected = selected === color;
            const padding = isSelected ? BTN_SIZE/2-ICON_SIZE/2 : BTN_SIZE/2;
            // TODO - do nicer (Box didnt work)
            const style = {
                backgroundColor: color,
                padding: padding
            };
            return (
                <IconButton onClick={() => select(color)} style={style} key={color}>
                    {isSelected && <CheckIcon/>}
                </IconButton>
            )
        });

        return (
            <Box width={4*BTN_SIZE} m={4} className="Color-picker">
                { colorButtons }

                <style jsx>{`
                    .Color-picker button {
                        margin: 0;
                        border-radius: 0;
                        color: white;
                    }
                `}</style>
            </Box>
        );
    }

}