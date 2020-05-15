import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  RouteComponentProps,
} from 'react-router-dom';
import './App.scss';
import {JustOne} from './just-one/JustOne';

export const API_URL = window.location.protocol + '//' + window.location.hostname + ':9000/api';
export const GAME_URL = API_URL + '/games';

function App() {
  return (
  	<Router>
	    <div className="App">
	      <Switch>
            <Route path="/:gameId" component={(props: RouteComponentProps<any>) => <JustOne gameId={props.match.params.gameId}/>} />
            <Route children={<JustOne/>} />
          </Switch> 
	    </div>	
  	</Router>
  );
}

export default App;
