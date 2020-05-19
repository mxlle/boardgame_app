import React from 'react';
import { Button, Typography } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';

type WordAdderProps = {
  add: (words: string[])=>void,
  numOfWords: number
}

type WordAdderState = {
  words: string[]
}

export class WordAdder extends React.Component<WordAdderProps, WordAdderState> {

  public state: WordAdderState = {
    words: []
  };

  constructor(props: WordAdderProps) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.keyPressed = this.keyPressed.bind(this);
  }

  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
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

  keyPressed(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      const words = this.state.words;
      const enterDisabled = words.length < this.props.numOfWords || words.some(word => !word || word.length === 0);
      if (!enterDisabled) this.props.add(words);
    }
  }

  render() {
    const { add, numOfWords } = this.props;
    const { words } = this.state;
    const wordFields = [];
    for (let i=0; i<numOfWords; i++) {
      wordFields.push(
        <TextField required label={`Wort ${numOfWords > 1 ? (i+1) : ''}`}
          placeholder="Ratebegriff eingeben"
          name={`word${i}`}
          key={`word${i}`}
          value={words[i]||''} 
          onChange={this.handleChange} 
          onKeyPress={this.keyPressed}/>
      );
    }
    
    const enterDisabled = words.length < numOfWords || words.some(word => !word || word.length === 0);

    return (
      <div className="Word-adder">
        <Typography variant="subtitle1">
          Gib {numOfWords>1?`${numOfWords} Wörter` : `ein Wort`} für das Spiel ein
        </Typography>
        {wordFields}
        <Button variant="contained" color="primary" 
          disabled={enterDisabled} 
          onClick={() => add(words)}>Jetzt abschicken</Button>
      </div>
    );
  }

}