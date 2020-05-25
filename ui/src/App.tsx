import React, { useState, Suspense } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    RouteComponentProps,
} from 'react-router-dom';
import './App.scss';
import { Paper, CircularProgress } from '@material-ui/core';
import { createMuiTheme, ThemeProvider, makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { SnackbarProvider } from 'notistack';

import { SETTING_COLOR, SETTING_THEME, ThemeMode } from './shared/constants';
import { getTheme, STYLES } from './theme';
import HeaderBar from './common/HeaderBar';
import JustOneHome from './just-one/JustOneHome';
import JustOneGame from './just-one/JustOneGame';

import './i18n';

const useStyles = makeStyles({
    root: {
        ...STYLES.rootSizing,
        textAlign: 'center'
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

    const classNames = ['App'];

    return (
        <ThemeProvider theme={theme}>
            <Suspense fallback={<Loader/>}>
                <Router>
                    <SnackbarProvider maxSnack={2} anchorOrigin={{ vertical: 'bottom', horizontal: 'center'}}>
                        <Paper square elevation={0} className={classes.root} style={{backgroundColor: theme.palette.background.default}}>
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
const Loader = () => {
    const classes = useStyles();
    return (
        <Paper square elevation={0} className={`${classes.root} ${classes.loading}`}>
            <CircularProgress />
        </Paper>
    );
};
