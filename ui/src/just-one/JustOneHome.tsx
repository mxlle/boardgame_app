import React from 'react';
import { Button, TextField } from '@material-ui/core';
import { IGame } from '../custom.d';
import { GameList } from './GameList';

import { SETTING_ID, SETTING_NAME, DEFAULT_NUM_WORDS } from '../shared/constants';
import { setDocumentTitle } from '../shared/functions';
import { loadGames, createGame, deleteGame } from '../shared/apiFunctions';

const POLLING_INTERVAL = 3000;

type JustOneHomeProps = {};
type JustOneHomeState = {
    newGameName: string,
    allGames: IGame[]
};

export class JustOneHome extends React.Component<JustOneHomeProps,JustOneHomeState> {
    public currentUserId: string = localStorage.getItem(SETTING_ID) || '';
    public currentUserName: string = localStorage.getItem(SETTING_NAME) || '';

    private _interval: number|undefined;
    private _isMounted: boolean = false;

    constructor(props: JustOneHomeProps) {
        super(props);

        this.createGame = this.createGame.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.deleteGame = this.deleteGame.bind(this);

        let newGameName = this.currentUserName ? `${this.currentUserName}s Spiel` : 'Neues Spiel';

        this.state = { allGames: [], newGameName: newGameName };
    }

    componentDidMount() {
        this._isMounted = true;

        setDocumentTitle();

        this.loadGames();
        this._interval = window.setInterval(this.loadGames.bind(this), POLLING_INTERVAL);
    }

    componentWillUnmount() {
        this._isMounted = false;
        clearInterval(this._interval);
    }

    async loadGames() {
        let games = await loadGames();
        if (!this._isMounted) return;
        this.setState({
            allGames: games
        });
    }

    deleteGame(gameId: string) {
        deleteGame(gameId);
        this.setState((state) => {
            return {
                allGames: state.allGames.filter(g => g.id !== gameId)
            }
        });
    }

    handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({newGameName: event.target.value});
    }

    async createGame() {
        const game: IGame = emptyGame();
        game.name = this.state.newGameName;

        const {id, playerId} = await createGame(game);

        if(this.currentUserId !== playerId) {
            localStorage.setItem(SETTING_ID, playerId);
        }
        window.location.href = '/' + id;
    }

    render() {
        const {newGameName, allGames} = this.state;

        return (
            <div className="JustOneHome">
                <TextField label={'Spielname'} value={newGameName} onChange={this.handleChange} />
                <Button variant="contained" color="primary" onClick={this.createGame}>Neues Spiel</Button>
                <GameList allGames={allGames} deleteGame={this.deleteGame} />
            </div>
        );
    }
}

function emptyGame(): IGame {
    return {"id":"", "name": "", "words":[],"players":[],"host":"","wordsPerPlayer":DEFAULT_NUM_WORDS,"round":0,"phase":0,"hints":[],"correctWords":[],"wrongWords":[]};
}