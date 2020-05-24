import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { Container, Box, Button, TextField } from '@material-ui/core';
import { Trans } from 'react-i18next';
import { withSnackbar, WithSnackbarProps, CloseReason } from 'notistack';
import { IGame } from '../custom.d';
import { GameList } from './GameList';
import { ActionButton } from '../common/ActionButton';

import { SETTING_ID, SETTING_NAME, DEFAULT_NUM_WORDS } from '../shared/constants';
import { setDocumentTitle } from '../shared/functions';
import { loadGames, createGame, deleteGame } from '../shared/apiFunctions';
import i18n from '../i18n';

type JustOneHomeProps = {}&WithSnackbarProps&RouteComponentProps;
type JustOneHomeState = {
    newGameName: string|null,
    allGames: IGame[],
    gamesLoading: boolean
};

class JustOneHome extends React.Component<JustOneHomeProps,JustOneHomeState> {
    public currentUserId: string = localStorage.getItem(SETTING_ID) || '';
    public currentUserName: string = localStorage.getItem(SETTING_NAME) || '';

    private _interval: number|undefined;
    private _isMounted: boolean = false;

    constructor(props: JustOneHomeProps) {
        super(props);

        this.createGame = this.createGame.bind(this);
        this.loadGames = this.loadGames.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.triggerDeleteGame = this.triggerDeleteGame.bind(this);
        this.deleteGame = this.deleteGame.bind(this);

        this.state = { allGames: [], newGameName: null, gamesLoading: true };
    }

    componentDidMount() {
        this._isMounted = true;

        setDocumentTitle();

        this.loadGames();
    }

    componentWillUnmount() {
        this._isMounted = false;
        clearInterval(this._interval);
    }

    async loadGames() {
        this.setState({
            gamesLoading: true
        });
        try {
            let games = await loadGames();
            if (!this._isMounted) return;     
            this.setState({
                allGames: games,
                gamesLoading: false
            });
        } catch(e) {
            this.props.enqueueSnackbar(i18n.t('ERROR.LOAD_GAMES', 'Fehler'), { variant: 'error' });
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
                    <Trans i18nKey="COMMON.UNDO">Rückgängig</Trans>
                </Button>
            </React.Fragment>
        );
        this.props.enqueueSnackbar(i18n.t('HOME.DELETED_GAME', 'Spiel gelöscht'), {
            action: action,
            onClose: (_: any, reason: CloseReason) => {
                if (reason !== 'instructed') {
                    this.deleteGame(gameId);
                }
            }
        });
    }

    async deleteGame(gameId: string) {
        await deleteGame(gameId);
        this.loadGames();
    }

    handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({newGameName: event.target.value});
    }

    async createGame() {
        const game: IGame = emptyGame();
        let gameName = this.state.newGameName;
        if (gameName === null) gameName = getInitialGameName(this.currentUserName);
        game.name = gameName;

        try {
            const {id, playerId} = await createGame(game);

            if(this.currentUserId !== playerId) {
                localStorage.setItem(SETTING_ID, playerId);
            }

            this.props.history.push('/'+id);

        } catch(e) {
            this.props.enqueueSnackbar(i18n.t('ERROR.CREATE_GAME', 'Fehler'), { variant: 'error' });
        }
    }

    render() {
        let {newGameName, allGames, gamesLoading} = this.state;
        if (newGameName === null) newGameName = getInitialGameName(this.currentUserName);

        return (
            <Container maxWidth="sm" className="JustOneHome">
                <Box className="newGameBox">
                    <TextField label={<Trans i18nKey="HOME.GAME_NAME">Spielname</Trans>} value={newGameName} onChange={this.handleChange} />
                    <Button variant="contained" color="primary" onClick={this.createGame}>
                        <Trans i18nKey="HOME.NEW_GAME">Neues Spiel</Trans>
                    </Button>         
                </Box>
                <ActionButton loading={gamesLoading}>
                    <Button variant="contained" onClick={this.loadGames}>
                        <Trans i18nKey="HOME.LOAD_GAMES">Spiele aktualisieren</Trans>
                    </Button>
                </ActionButton>
                <GameList allGames={allGames} deleteGame={this.triggerDeleteGame} />
            </Container>
        );
    }
}

function getInitialGameName(userName?: string) {
    return userName ? i18n.t('HOME.NEW_GAME_PERSONAL', 'Neues Spiel', {name: userName}) : i18n.t('HOME.NEW_GAME', 'Neues Spiel');
}

function emptyGame(): IGame {
    return {"id":"", "name": "", "words":[],"players":[],"host":"","wordsPerPlayer":DEFAULT_NUM_WORDS,"round":0,"phase":0,"hints":[],"correctWords":[],"wrongWords":[]};
}

export default withRouter(withSnackbar(JustOneHome));