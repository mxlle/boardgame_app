import React, { useState, Suspense } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    RouteComponentProps,
} from 'react-router-dom';
import './App.scss';
import { Paper, CircularProgress } from '@material-ui/core';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { SnackbarProvider } from 'notistack';

import { SETTING_COLOR, SETTING_THEME, 
         ThemeMode, DEFAULT_PRIMARY_COLOR, DEFAULT_SECONDARY_COLOR } from './shared/constants';

import {HeaderBar} from './common/HeaderBar';
import JustOneHome from './just-one/JustOneHome';
import {JustOneGame} from './just-one/JustOneGame';

import './i18n';

export const App = () =>    {
    const [userColor, setUserColor] = useState(localStorage.getItem(SETTING_COLOR));
    const [userTheme, setUserTheme] = useState(localStorage.getItem(SETTING_THEME) || ThemeMode.AUTO);

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
        <ThemeProvider theme={theme}>
            <Suspense fallback={<Loader classes={classNames}/>}>
                <Router>
                    <SnackbarProvider maxSnack={2} anchorOrigin={{ vertical: 'bottom', horizontal: 'center'}}>
                        <Paper square elevation={0} className={classNames.join(' ')}>
                            <HeaderBar userTheme={userTheme} applyUserTheme={applyUserTheme}/>
                            <Switch>
                                <Route path="/:gameId" component={(props: RouteComponentProps<any>) => <JustOneGame gameId={props.match.params.gameId} setTheme={setUserColor}/>} />
                                <Route children={<JustOneHome/>} />
                            </Switch> 
                        </Paper>
                    </SnackbarProvider>
                </Router>
            </Suspense>
        </ThemeProvider>
    );    
}

export default App;

// TODO 
const Loader = (props: {classes: string[]}) => {
    let {classes} = props;
    classes.push('App-loading');
    return (
        <Paper square elevation={0} className={classes.join(' ')}>
            <CircularProgress />
        </Paper>
    );
};
