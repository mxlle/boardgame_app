import React from 'react';
import { IGame, IUser, GamePhase } from '../custom.d';
import { Button, Paper } from '@material-ui/core';
import { WordHint } from './components/WordHint';
import { NewPlayer } from '../common/NewPlayer';
import { WordAdder } from './components/WordAdder';
import { RoundSelector } from './components/RoundSelector';
import { getRandomColor } from '../common/ColorPicker';

import { SETTING_ID, SETTING_NAME, SETTING_COLOR, DEFAULT_NUM_WORDS } from '../shared/constants';
import * as api from '../shared/apiFunctions';

type GameLobbyProps = {
    game: IGame,
    setTheme?: (color: string)=>void
}
type GameLobbyState = {
    currentPlayer: IUser,
    roundDialogOpen: boolean
}

export class GameLobby extends React.Component<GameLobbyProps,GameLobbyState> {

    public state: GameLobbyState = { 
        currentPlayer: {
            id: localStorage.getItem(SETTING_ID) || '',
            name: localStorage.getItem(SETTING_NAME) || '',
            color: getRandomColor(localStorage.getItem(SETTING_COLOR))
        }, 
        roundDialogOpen: false
    };

    constructor(props: GameLobbyProps) {
        super(props);

        this.addPlayer = this.addPlayer.bind(this);
        this.addWords = this.addWords.bind(this);
        this.setPlayerProps = this.setPlayerProps.bind(this);
        this.selectNumRounds = this.selectNumRounds.bind(this);
        this.startPreparation = this.startPreparation.bind(this);
    }

    setPlayerProps(player: IUser) {
        this.setState({
            currentPlayer: player
        });
    }

    async addPlayer(player: IUser) {
        const resultPlayer = await api.addPlayer(this.props.game.id, player);
        if (!resultPlayer) return;
        this.setLocalPlayer(resultPlayer);
    }

    async addWords(words: string[]) {
        let player: IUser = this.state.currentPlayer;
        player.enteredWords = words;

        const resultPlayer = await api.updatePlayer(this.props.game.id, player);
        if (!resultPlayer) return;
        this.setLocalPlayer(resultPlayer);
    }

    setLocalPlayer(player: IUser) {
        localStorage.setItem(SETTING_ID, player.id);
        localStorage.setItem(SETTING_NAME, player.name);
        if (player.color) localStorage.setItem('playerColor', player.color);
        if (this.props.setTheme && player.color) {
            this.props.setTheme(player.color);
        }
        this.setState({
            currentPlayer: player
        });
    }

    selectNumRounds() {
        this.setState({
            roundDialogOpen: true
        });
    }

    startPreparation(wordsPerPlayer: number = DEFAULT_NUM_WORDS) {
        this.setState({
            roundDialogOpen: false
        });

        api.startPreparation(this.props.game.id, wordsPerPlayer);
    }

    render() {
        const { game } = this.props;
        const { currentPlayer, roundDialogOpen } = this.state;
        const numWordsPerPlayer = game.wordsPerPlayer || DEFAULT_NUM_WORDS;
        const currentUserId: string = localStorage.getItem(SETTING_ID) || '';
        const isHost: boolean = !!currentUserId && game.host === currentUserId;
        let isInGame: boolean = false;
        let listOfPlayers;

        if (game.phase === GamePhase.Init) {
            listOfPlayers = game.players.map(player => {
                if (player.id === currentUserId) {
                    isInGame = true;
                } 
                return (
                    <WordHint key={player.id} hint={player.name} color={player.color}></WordHint>
                )
            });
            const newPlayerName: string = !currentPlayer.name ? '?' : currentPlayer.name;
            const newPlayerColor: string = !currentPlayer.color ? getRandomColor() : currentPlayer.color;

            return (
                <div className="Game-lobby">
                    <div className="New-player">
                        { 
                            isInGame ? (
                                <Paper className="StatusInfo">
                                    Warten auf Mitspieler ... Sobald alle Mitspieler da sind, { isHost ? 'kannst du' : 'kann der Spielleiter'} das Spiel starten. 
                                </Paper>
                            ) : (
                                <NewPlayer currentPlayer={currentPlayer}
                                    updatePlayer={this.setPlayerProps}
                                    addPlayer={this.addPlayer}/>
                            )
                        }
                        {
                            isHost && isInGame && (
                                <Button variant="contained" color="primary" 
                                    disabled={game.players.length < 3}
                                    onClick={this.selectNumRounds}>Alle Spieler sind da</Button>
                            )
                        }
                    </div>
                    <div className="Player-list">
                        {listOfPlayers}
                        {!isInGame && <WordHint hint={newPlayerName} color={newPlayerColor} showPencil={true}></WordHint>}
                    </div>
                    <RoundSelector numOfPlayers={game.players.length} open={roundDialogOpen} onClose={this.startPreparation}/>
                </div>
            );
        } else if (game.phase === GamePhase.Preparation) {
            //let myWords: string[] = [];
            let allMyWordsEntered: boolean = false;
            listOfPlayers = game.players.map(player => {
                const wordsEntered: boolean = !!player.enteredWords && player.enteredWords.length === numWordsPerPlayer;
                if (player.id === currentUserId) {
                    isInGame = true;
                    //myWords = player.enteredWords || [];
                    allMyWordsEntered = wordsEntered;
                } 
                return (
                    <WordHint key={player.id} hint={player.name} color={player.color} showPencil={!wordsEntered}></WordHint>
                )
            });

            // TODO not in game users
            return (
                <div className="Game-lobby">
                    <div className="New-player">
                        { 
                            allMyWordsEntered || !isInGame ? ( 
                                <Paper className="StatusInfo">
                                    Warten auf Mitspieler ... Sobald alle fertig sind, geht's los. 
                                </Paper>
                            ) : (
                                <WordAdder add={this.addWords} numOfWords={numWordsPerPlayer}/>
                            )
                        }
                    </div>
                    <div className="Player-list">
                        {listOfPlayers}
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }

}