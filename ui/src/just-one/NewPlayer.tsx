import React from 'react';
import { IUser } from '../custom.d';
import { Button } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';

type NewPlayerProps = {
  addPlayer: (player: IUser) => void,
  name?: string,
  color?: string
}
type NewPlayerState = {
  name: string,
  color: string
}

export class NewPlayer extends React.Component<NewPlayerProps,NewPlayerState> {

  public state: NewPlayerState = { 
    name: this.props.name || '',
    color: this.props.color || 'black'
  };

  constructor(props: NewPlayerProps) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.addPlayer = this.addPlayer.bind(this);
  }

  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.name === 'name') {
      this.setState({
        name: event.target.value
      });  
    } else if (event.target.name === 'color') {
      this.setState({
        color: event.target.value
      });  
    }
  }

  addPlayer() {
    const player: IUser = { id: '', name: this.state.name, color: this.state.color };
    this.props.addPlayer(player);
  }

  render() {
    return (
      <div className="New-player">
        <TextField required label="Spielername" 
          name='name'
          value={this.state.name} 
          onChange={this.handleChange}  />
        <TextField required label="Spielerfarbe" 
          placeholder="Html-Farbcode"
          name='color'
          value={this.state.color} 
          onChange={this.handleChange}  />
        <Button variant="contained" color="primary" 
          disabled={!this.state.name} 
          onClick={this.addPlayer}>Mitspielen</Button>
      </div>
    );
  }

}