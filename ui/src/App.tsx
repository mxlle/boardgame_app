import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  RouteComponentProps,
} from 'react-router-dom';
import './App.scss';
import { Button, AppBar, Toolbar, IconButton, Typography, Chip } from '@material-ui/core';
import { Home as HomeIcon, AccountCircle as AccountCircleIcon } from '@material-ui/icons';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { teal, pink } from '@material-ui/core/colors';

import {JustOne} from './just-one/JustOne';


const isProd = window.location.hostname === 'justone.okj.name';
const apiPort = isProd ? ':9001' : ':9000';
export const API_URL = window.location.protocol + '//' + window.location.hostname + apiPort + '/api';
export const GAME_URL = API_URL + '/games';
export const SETTING_ID = 'playerId';
export const SETTING_NAME = 'playerName';
export const SETTING_COLOR = 'playerColor';
const DEFAULT_PRIMARY_COLOR = '#43a047';
const DEFAULT_SECONDARY_COLOR = '#3949ab';

function App() {
  const currentUserName: string|null = localStorage.getItem(SETTING_NAME);

  const primaryColor = localStorage.getItem(SETTING_COLOR) || DEFAULT_PRIMARY_COLOR;

  const theme = createMuiTheme({
    palette: {
      primary: {
        main: primaryColor
      },
      secondary: {
        main: DEFAULT_SECONDARY_COLOR,
      },  
    }
  });

  return (
    <Router>
      <ThemeProvider theme={theme}>
      <div className="App">
        <AppBar position="sticky">
          <Toolbar>
            <Link to="/" className="ButtonLink">
              <IconButton edge="start" color="inherit" aria-label="home">
                <HomeIcon />
              </IconButton>
            </Link>
            <Typography variant="h2" className="appTitle">
              Nur ein Wort!
            </Typography>
            {currentUserName && <Chip label={currentUserName} icon={<AccountCircleIcon />}/>}
          </Toolbar>
        </AppBar>
        <Switch>
            <Route path="/:gameId" component={(props: RouteComponentProps<any>) => <JustOne gameId={props.match.params.gameId}/>} />
            <Route children={<JustOne/>} />
          </Switch> 
      </div>  
    </ThemeProvider>
    </Router>
  );
}

export default App;
