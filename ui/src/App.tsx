import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  RouteComponentProps,
} from 'react-router-dom';
import './App.scss';
import { AppBar, Toolbar, IconButton, Typography, Paper, Button } from '@material-ui/core';
import { Home as HomeIcon, AccountCircle as AccountCircleIcon } from '@material-ui/icons';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { SETTING_NAME, SETTING_COLOR, SETTING_THEME, 
         ThemeMode, DEFAULT_PRIMARY_COLOR, DEFAULT_SECONDARY_COLOR } from './shared/constants';

import {JustOneHome} from './just-one/JustOneHome';
import {JustOneGame} from './just-one/JustOneGame';
import { UserConfig } from './common/UserConfig';

export const App = () =>  {
  const [userColor, setUserColor] = useState(localStorage.getItem(SETTING_COLOR));
  const [userTheme, setUserTheme] = useState(localStorage.getItem(SETTING_THEME) || ThemeMode.AUTO);
  const [userConfigOpen, setUserConfigOpen] = React.useState(false);

  const currentUserName: string|null = localStorage.getItem(SETTING_NAME);
  let prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  if (userTheme === ThemeMode.BRIGHT) {
    prefersDarkMode = false;
  } else if (userTheme === ThemeMode.DARK) {
    prefersDarkMode = true;
  }

  let primaryColor = userColor;
  if (!primaryColor || !primaryColor.startsWith('#') || primaryColor.length !== 7) {
    primaryColor = DEFAULT_PRIMARY_COLOR;
  }

  const applyUserTheme = (value: string) => {
    setUserTheme(value);
    localStorage.setItem(SETTING_THEME, value);
    setUserConfigOpen(false);
  }

  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          primary: {
            main: primaryColor || DEFAULT_PRIMARY_COLOR
          },
          secondary: {
            main: DEFAULT_SECONDARY_COLOR,
          }, 
          type: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode, primaryColor],
  );

  const classNames = ['App'];
  if (prefersDarkMode) classNames.push('App-dark');

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <Paper square elevation={0} className={classNames.join(' ')}>
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
              { 
                currentUserName ? 
                <Button onClick={()=>setUserConfigOpen(true)} className="Account-button" color="inherit" startIcon={<AccountCircleIcon />}>
                  {currentUserName}
                </Button> : 
                <IconButton onClick={()=>setUserConfigOpen(true)} edge="end" color="inherit">
                  <AccountCircleIcon />
                </IconButton>
              }
              <UserConfig 
                open={userConfigOpen} 
                onClose={applyUserTheme} 
                selectedValue={userTheme} 
                possibleValues={[ThemeMode.AUTO, ThemeMode.BRIGHT, ThemeMode.DARK]}
              ></UserConfig>
            </Toolbar>
          </AppBar>
          <Switch>
            <Route path="/:gameId" component={(props: RouteComponentProps<any>) => <JustOneGame gameId={props.match.params.gameId} setTheme={setUserColor}/>} />
            <Route children={<JustOneHome/>} />
          </Switch> 
        </Paper>  
      </ThemeProvider>
    </Router>
  );  
}

export default App;
