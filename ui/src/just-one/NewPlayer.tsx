import React from 'react';
import { IUser } from '../custom.d';
import { Button, Typography, InputAdornment } from '@material-ui/core';
import { Opacity as OpacityIcon, AccountCircle as AccountCircleIcon  } from '@material-ui/icons';
import TextField from '@material-ui/core/TextField';
const ShortUniqueId = require('short-unique-id').default;

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
    this.setRandomColor = this.setRandomColor.bind(this);
    this.addPlayer = this.addPlayer.bind(this);
  }

  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (['name','color'].includes(event.target.name)) {
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
      color: this.props.color,
      enteredWords: this.state.words
    };
    this.props.addPlayer(player);
  }

  render() {
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
          value={this.state.words[i]||''} 
          onChange={this.handleChange} />
      );
    }
    let enterDisabled = !this.props.name || this.state.words.length < numOfWords || this.state.words.some(word => !word || word.length === 0);

    return (
      <div className="New-player">
        <TextField required label="Spielername" 
          name='name'
          value={this.props.name} 
          onChange={this.handleChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <AccountCircleIcon style={{color: this.props.color}}></AccountCircleIcon>
              </InputAdornment>
            )  
          }} />
        <TextField required label="Spielerfarbe" 
          placeholder="Html-Farbcode"
          name='color'
          value={this.props.color} 
          onChange={this.handleChange}
          InputProps={{
            style: {color: this.props.color},
            endAdornment: (
              <InputAdornment position="end">
                <OpacityIcon style={{color: this.props.color}}></OpacityIcon>
              </InputAdornment>
            )  
          }} />
        <Button variant="contained" 
          onClick={this.setRandomColor}>Zufallsfarbe</Button>
        {wordFields}
        <Button variant="contained" color="primary" 
          disabled={enterDisabled} 
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