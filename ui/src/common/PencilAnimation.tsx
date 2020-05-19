import React from 'react';

type PencilAnimationProps = {
	color?: string,
}

export class PencilAnimation extends React.Component<PencilAnimationProps> {

  render() {
    const styleObj1 = {
    	backgroundColor: this.props.color,
    };
    const styleObj2 = {
    	borderTopColor: this.props.color,
    };

    return (
	  <div className="pencil">
        <div className="body" style={styleObj1}></div>
        <div className="nib" style={styleObj2}></div>
      </div>
    );
  }

}