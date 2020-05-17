import React from 'react';
import { IUser } from '../custom.d';
import { Button, Typography } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { ColorPicker } from '../common/ColorPicker';

const DEFAULT_NUM_WORDS: number = 2; // Two words per player

type NewPlayerProps = {
  addPlayer: (player: IUser) => void,
  updatePlayer: (player: IUser) => void,
  name: string,
  color: string
}

type NewPlayerState = {
  words: string[]
}

export class NewPlayer extends React.Component<NewPlayerProps, NewPlayerState> {

  public state: NewPlayerState = {
    words: []
  };

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

    } else if (event.target.name.startsWith('word')) {
      const index = parseInt(event.target.name.substr(4));
      const word = event.target.value;
      this.setState((state, props) => {
        const newWords = state.words;
        newWords[index] = word;
        return {
          words: newWords
        };
      });
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
      enteredWords: this.state.words
    };
    this.props.addPlayer(player);
  }

  render() {
    const { name, color } = this.props;
    const { words } = this.state;
    const numOfWords = DEFAULT_NUM_WORDS;
    const wordFields = [];
    if (numOfWords>0) {
      wordFields.push(
        <Typography variant="subtitle1" key="heading">
          Gebe {numOfWords} Wörter für das Spiel ein
        </Typography>
      );
    }
    for (let i=0; i<numOfWords; i++) {
      wordFields.push(
        <TextField required label={`Wort ${i+1}`}
          placeholder="Für den Stapel"
          name={`word${i}`}
          key={`word${i}`}
          value={words[i]||''} 
          onChange={this.handleChange} />
      );
    }
    let enterDisabled = !name || words.length < numOfWords || words.some(word => !word || word.length === 0);

    return (
      <div className="New-player">
        <TextField required label="Spielername" 
          name='name'
          value={name} 
          onChange={this.handleChange}/>
        <ColorPicker select={this.setColor} selected={color}/>
        {wordFields}
        <Button variant="contained" color="primary" 
          disabled={enterDisabled} 
          onClick={this.addPlayer}>Mitspielen</Button>
      </div>
    );
  }

}