import React from 'react';
import { IUser } from '../custom.d';
import { Button } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { ColorPicker } from '../common/ColorPicker';

type NewPlayerProps = {
  addPlayer: (player: IUser) => void,
  updatePlayer: (player: IUser) => void,
  currentPlayer: IUser
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
      this.props.currentPlayer.name = event.target.value;

      this.props.updatePlayer(this.props.currentPlayer);   

    }
  }

  setColor(color: string) {
    this.props.currentPlayer.color = color;
    this.props.updatePlayer(this.props.currentPlayer);  
  }

  addPlayer() {
    this.props.addPlayer(this.props.currentPlayer);
  }

  render() {
    const { currentPlayer } = this.props;

    return (
      <div className="New-player">
        <TextField required label="Spielername" 
          name='name'
          value={currentPlayer.name} 
          onChange={this.handleChange}/>
        <ColorPicker select={this.setColor} selected={currentPlayer.color}/>
        <Button variant="contained" color="primary" 
          disabled={!currentPlayer.name} 
          onClick={this.addPlayer}>Mitspielen</Button>
      </div>
    );
  }

}