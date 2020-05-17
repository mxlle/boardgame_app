import React from 'react';
import { IconButton } from '@material-ui/core';
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

export class ColorPicker extends React.Component<ColorPickerProps> {

  render() {
  	const { selected, select } = this.props;

    const colorButtons = allColors.map((color: string) => {
      const classes = ['Color-button'];
      if (selected === color) classes.push('Color-selected');
      return (
        <IconButton className={classes.join(' ')} onClick={() => select(color)} style={{ backgroundColor: color }} key={color}>
          {selected === color && <CheckIcon/>}
        </IconButton>
      )
    });

    return (
      <div className="Color-picker">
        { colorButtons }
      </div>
    );
  }

}