import React from 'react';
import {JustOneHome} from './JustOneHome';
import {JustOneGame} from './JustOneGame';

type JustOneProps = {
  gameId?: string,
  setTheme?: (color: string)=>void
};
type JustOneState = {

};

export class JustOne extends React.Component<JustOneProps,JustOneState> {
  render() {
    if (this.props.gameId) {
      return <JustOneGame gameId={this.props.gameId}></JustOneGame>;
    } else {
      return <JustOneHome></JustOneHome>
    }
  }
}