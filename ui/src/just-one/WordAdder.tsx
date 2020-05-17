import React from 'react';
import { Button, Typography } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';

export const DEFAULT_NUM_WORDS: number = 2; // Two words per player

type WordAdderProps = {
  add: (words: string[])=>void
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

  render() {
    const { add } = this.props;
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
    let enterDisabled = words.length < numOfWords || words.some(word => !word || word.length === 0);

    return (
      <div className="Word-adder">
        {wordFields}
        <Button variant="contained" color="primary" 
          disabled={enterDisabled} 
          onClick={() => add(words)}>Wörter abschicken</Button>
      </div>
    );
  }

}