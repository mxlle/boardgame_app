import React from 'react';
import { Button } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';

type WordHintInputProps = {
  submitHint: (hint: string)=>void
};
type WordHintInputState = {
  value: string, 
};

export class WordHintInput extends React.Component<WordHintInputProps,WordHintInputState> {

  constructor(props: WordHintInputProps) {
  	super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.submitHint = this.submitHint.bind(this);
    this.keyPressed = this.keyPressed.bind(this);
  }

  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({value: event.target.value});
  }

  submitHint() {
  	this.props.submitHint(this.state.value)
  	this.setState({value: ''});
  }

  keyPressed(event: React.KeyboardEvent<HTMLInputElement>) {
  	if (event.key === "Enter") {
  	  this.submitHint()
  	}
  }

  render() {
    return (
	    <div className="Word-hint-input">
	    	<TextField required label="Wort-Hinweis" 
	    		value={this.state.value} 
	    		onChange={this.handleChange} 
	    		onKeyPress={this.keyPressed} />
  			<Button variant="contained" color="primary" 
  				disabled={!this.state.value} 
  				onClick={this.submitHint}>Hinweis abschicken</Button>
	    </div>
    );
  }

}