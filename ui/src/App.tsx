import React, {Suspense, useState} from 'react';
import {BrowserRouter as Router, Route, RouteComponentProps, Switch,} from 'react-router-dom';
import './App.scss';
import {Paper} from '@material-ui/core';
import {createMuiTheme, makeStyles, ThemeProvider} from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {SnackbarProvider} from 'notistack';

import {SETTING_COLOR, SETTING_THEME, ThemeMode} from './shared/constants';
import {getTheme, STYLES} from './theme';
import HeaderBar from './common/HeaderBar';
import Loader from "./common/Loader";
import JustOneHome from './one-word/OneWordHome';
import OneWordGame from './one-word/OneWordGame';

import './i18n';
import ConnectionMonitor from "./one-word/components/ConnectionMonitor";
import socket from "./shared/socket";
import ChatGptPlayground from "./one-word/ChatGptPlayground";

const useStyles = makeStyles({
    root: {
        ...STYLES.rootSizing,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column'
    },
    loading: {
        ...STYLES.flexCenter
    }
});

export const App = () =>    {
    const [userColor, setUserColor] = useState(localStorage.getItem(SETTING_COLOR));
    const [userTheme, setUserTheme] = useState(localStorage.getItem(SETTING_THEME) || ThemeMode.AUTO);
    const classes = useStyles();

    let prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    if (userTheme === ThemeMode.BRIGHT) {
        prefersDarkMode = false;
    } else if (userTheme === ThemeMode.DARK) {
        prefersDarkMode = true;
    }

    const applyUserTheme = (value: string) => {
        setUserTheme(value);
        localStorage.setItem(SETTING_THEME, value);
    }

    const theme = React.useMemo(() => createMuiTheme(getTheme(userColor, prefersDarkMode)), [userColor, prefersDarkMode]);

    return (
        <ThemeProvider theme={theme}>
            <Suspense fallback={<Loader className={classes.root}/>}>
                <Router>
                    <SnackbarProvider maxSnack={2} anchorOrigin={{ vertical: 'bottom', horizontal: 'center'}}>
                        <Paper square elevation={0} className={classes.root} style={{backgroundColor: theme.palette.background.default}}>
                            <HeaderBar userTheme={userTheme} applyUserTheme={applyUserTheme}/>
                            <Switch>
                                <Route path="/chat-gpt-playground" children={<ChatGptPlayground/>} />
                                <Route path="/:gameId" component={(props: RouteComponentProps<any>) => <OneWordGame gameId={props.match.params.gameId} setTheme={setUserColor}/>} />
                                <Route children={<JustOneHome/>} />
                            </Switch>
                            <ConnectionMonitor socket={socket}/>
                        </Paper>
                    </SnackbarProvider>
                </Router>
            </Suspense>
        </ThemeProvider>
    );    
}

export default App;
