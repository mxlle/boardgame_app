import React from 'react';
import { IUser } from '../custom.d';
import { Button } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { ColorPicker } from '../common/ColorPicker';

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
    this.setColor = this.setColor.bind(this);
    this.addPlayer = this.addPlayer.bind(this);
  }

  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.name === 'name') {
      let player: IUser = { 
        id: '', 
        name: event.target.value, 
        color: this.props.color 
      };

      this.props.updatePlayer(player);   

    }
  }

  setColor(color: string) {
    let player: IUser = { 
      id: '', 
      name: this.props.name, 
      color: color || this.props.color 
    };
    this.props.updatePlayer(player);  
  }

  addPlayer() {
    const player: IUser = { 
      id: '', 
      name: this.props.name, 
      color: this.props.color,
      enteredWords: []
    };
    this.props.addPlayer(player);
  }

  render() {
    const { name, color } = this.props;

    return (
      <div className="New-player">
        <TextField required label="Spielername" 
          name='name'
          value={name} 
          onChange={this.handleChange}/>
        <ColorPicker select={this.setColor} selected={color}/>
        <Button variant="contained" color="primary" 
          disabled={!name} 
          onClick={this.addPlayer}>Mitspielen</Button>
      </div>
    );
  }

}