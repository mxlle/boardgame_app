import React from 'react';
import { IconButton } from '@material-ui/core';
import { Send as SendIcon } from '@material-ui/icons';
import TextField from '@material-ui/core/TextField';

type WordHintInputProps = {
  submitHint: (hint: string)=>void
  label?: string
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
	    	<TextField label={this.props.label || 'Hinweis eingeben'}
	    		value={this.state.value} 
	    		onChange={this.handleChange} 
	    		onKeyPress={this.keyPressed} />
  			<IconButton color="primary" 
  				disabled={!this.state.value} 
  				onClick={this.submitHint}>
          <SendIcon></SendIcon>
        </IconButton>
	    </div>
    );
  }

}