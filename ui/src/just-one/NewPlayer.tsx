import React from 'react';
import { IUser } from '../custom.d';
import { Button } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
const ShortUniqueId = require('short-unique-id').default;

type NewPlayerProps = {
  addPlayer: (player: IUser) => void,
  updatePlayer: (player: IUser) => void,
  name: string,
  color: string
}

export class NewPlayer extends React.Component<NewPlayerProps> {

  constructor(props: NewPlayerProps) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.setRandomColor = this.setRandomColor.bind(this);
    this.addPlayer = this.addPlayer.bind(this);
  }

  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    let player: IUser = { 
      id: '', 
      name: this.props.name, 
      color: this.props.color 
    };
    if (event.target.name === 'name') {
      player.name = event.target.value;
    } else if (event.target.name === 'color') {
      player.color = event.target.value; 
    }

    this.props.updatePlayer(player);
  }

  setRandomColor() {
    const player: IUser = { 
      id: '', 
      name: this.props.name, 
      color: generateRandomColor()
    };
    this.props.updatePlayer(player);
  }

  addPlayer() {
    const player: IUser = { 
      id: '', 
      name: this.props.name, 
      color: this.props.color 
    };
    this.props.addPlayer(player);
  }

  render() {
    return (
      <div className="New-player">
        <TextField required label="Spielername" 
          name='name'
          value={this.props.name} 
          onChange={this.handleChange}  />
        <TextField required label="Spielerfarbe" 
          placeholder="Html-Farbcode"
          name='color'
          value={this.props.color} 
          onChange={this.handleChange}  />
        <Button variant="contained" 
          onClick={this.setRandomColor}>Zufallsfarbe</Button>
        <Button variant="contained" color="primary" 
          disabled={!this.props.name} 
          onClick={this.addPlayer}>Mitspielen</Button>
      </div>
    );
  }

}

export function generateRandomColor(): string {
  const generator = new ShortUniqueId({
    dictionary: [
      '0', '1', '2', '3',
      '4', '5', '6', '7',
      '8', '9', 'A', 'B',
      'C', 'D', 'E', 'F',
    ],
  });
  const color = '#' + generator(6);
  return color;
}