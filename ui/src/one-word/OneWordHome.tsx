import React from 'react';
import {RouteComponentProps, withRouter} from 'react-router-dom'
import {Box, Button, Container, TextField} from '@material-ui/core';
import {createStyles, Theme, WithStyles, withStyles} from '@material-ui/core/styles';
import {Trans, WithTranslation, withTranslation} from 'react-i18next';
import {CloseReason, withSnackbar, WithSnackbarProps} from 'notistack';
import {GameEvent, IGame, ROOM_GAME_LIST, SocketEvent} from '../types';
import {GameList} from './GameList';
import ActionButton from '../common/ActionButton';

import {SETTING_ID, SETTING_NAME} from '../shared/constants';
import api from '../shared/apiFunctions';
import {STYLES} from '../theme';
import {getCurrentLanguage} from '../i18n';
import {emptyGame} from "./gameFunctions";
import {TUTORIAL_ID} from "./tutorial";
import socket from "../shared/socket";

const styles = (theme: Theme) => createStyles({
    root: {
        ...STYLES.flexCenter,
        flexDirection: 'column',
    }, 
    newGame: {
        ...STYLES.flexCenter,
        flexDirection: 'column',
        padding: theme.spacing(2),
        margin: `${theme.spacing(2)}px 0`,
        '& button': {
            marginTop: theme.spacing(2)
        }
    }
});

type JustOneHomeProps = {}&WithTranslation&WithSnackbarProps&RouteComponentProps&WithStyles<typeof styles>;
type JustOneHomeState = {
    newGameName: string|null,
    allGames: IGame[],
    gamesLoading: boolean
};

class OneWordHome extends React.Component<JustOneHomeProps,JustOneHomeState> {
    public currentUserId: string = localStorage.getItem(SETTING_ID) || '';
    public currentUserName: string = localStorage.getItem(SETTING_NAME) || '';

    private _isMounted: boolean = false;

    constructor(props: JustOneHomeProps) {
        super(props);

        this.createGame = this.createGame.bind(this);
        this.startTutorial = this.startTutorial.bind(this);
        this.loadGames = this.loadGames.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.triggerDeleteGame = this.triggerDeleteGame.bind(this);
        this.deleteGame = this.deleteGame.bind(this);
        this._setupConnection = this._setupConnection.bind(this);

        this.state = { allGames: [], newGameName: null, gamesLoading: true };
    }

    componentDidMount() {
        this._isMounted = true;

        document.title = this.props.i18n.t('APP_TITLE', 'Just one word!');

        this._setupConnection();
        socket.on(GameEvent.UpdateList, this.loadGames);
        socket.on(SocketEvent.Reconnect, this._setupConnection);
    }

    componentWillUnmount() {
        this._isMounted = false;
        socket.emit(GameEvent.Unsubscribe, ROOM_GAME_LIST);
        socket.off(GameEvent.UpdateList, this.loadGames);
        socket.off(SocketEvent.Reconnect, this._setupConnection);
    }

    private _getInitialGameName(userName?: string) {
        return userName ? this.props.i18n.t('HOME.NEW_GAME_PERSONAL', 'New game', {name: userName}) : this.props.i18n.t('HOME.NEW_GAME', 'New game');
    }

    private _setupConnection() {
        socket.emit(GameEvent.Subscribe, ROOM_GAME_LIST);
        this.loadGames();
    }

    async loadGames() {
        this.setState({
            gamesLoading: true
        });
        try {
            let games = await api.loadGames();
            if (!this._isMounted) return;
            this.setState({
                allGames: games,
                gamesLoading: false
            });
        } catch(e) {
            this.props.enqueueSnackbar(<Trans i18nKey="ERROR.LOAD_GAMES">Error</Trans>, { variant: 'error' });
            this.setState({
                gamesLoading: false
            });
        }
    }

    triggerDeleteGame(gameId: string) {
        this.setState((state) => {
            return {
                allGames: state.allGames.filter(g => g.id !== gameId)
            }
        });
        const action = (key: string) => (
            <React.Fragment>
                <Button onClick={() => { this.props.closeSnackbar(key); this.loadGames(); }} color="inherit">
                    <Trans i18nKey="COMMON.UNDO">Undo</Trans>
                </Button>
            </React.Fragment>
        );
        this.props.enqueueSnackbar(<Trans i18nKey="HOME.DELETED_GAME">Deleted Game</Trans>, {
            action: action,
            onClose: (_: any, reason: CloseReason) => {
                if (reason !== 'instructed') {
                    this.deleteGame(gameId);
                }
            }
        });
    }

    async deleteGame(gameId: string) {
        await api.deleteGame(gameId);
        this.loadGames();
    }

    handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({newGameName: event.target.value});
    }

    async createGame() {
        const game: IGame = emptyGame();
        let gameName = this.state.newGameName;
        if (gameName === null) gameName = this._getInitialGameName(this.currentUserName);
        game.name = gameName;
        game.language = getCurrentLanguage();

        try {
            const gameId = await api.addGame(game);

            this.props.history.push('/'+gameId);

        } catch(e) {
            this.props.enqueueSnackbar(<Trans i18nKey="ERROR.CREATE_GAME">Error</Trans>, { variant: 'error' });
        }
    }

    startTutorial() {
        this.props.history.push('/' + TUTORIAL_ID);
    }

    render() {
        let { classes } = this.props;
        let {newGameName, allGames, gamesLoading} = this.state;
        if (newGameName === null) newGameName = this._getInitialGameName(this.currentUserName);

        return (
            <Container maxWidth="sm" className={classes.root}>
                <Box className={classes.newGame}>
                    <TextField label={<Trans i18nKey="HOME.GAME_NAME">Game name</Trans>} value={newGameName} onChange={this.handleChange} />
                    <Button variant="contained" color="primary" onClick={this.createGame}>
                        <Trans i18nKey="HOME.NEW_GAME">New game</Trans>
                    </Button>         
                </Box>
                <Box mb={2}>
                    <Button variant="contained" onClick={this.startTutorial}>
                        <Trans i18nKey="HOME.START_TUTORIAL">Tutorial</Trans>
                    </Button>
                </Box>
                <Box mb={2}>
                    <ActionButton loading={gamesLoading}>
                        <Button variant="contained" onClick={this.loadGames}>
                            <Trans i18nKey="HOME.LOAD_GAMES">Refresh</Trans>
                        </Button>
                    </ActionButton>
                </Box>
                <GameList allGames={allGames} deleteGame={this.triggerDeleteGame} />
            </Container>
        );
    }
}

export default withTranslation()(withRouter(withSnackbar(withStyles(styles)(OneWordHome))));
