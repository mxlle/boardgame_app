import React from 'react';
import { IGame, IUser } from '../custom.d';
import { Button, Paper, Typography } from '@material-ui/core';
import { Trans } from 'react-i18next';
import { WordHint } from './components/WordHint';
import { NewPlayer } from '../common/NewPlayer';
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
    roundDialogOpen: boolean,
    playerAdded?: boolean
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

    setLocalPlayer(player: IUser) {
        localStorage.setItem(SETTING_ID, player.id);
        localStorage.setItem(SETTING_NAME, player.name);
        if (player.color) localStorage.setItem('playerColor', player.color);
        if (this.props.setTheme && player.color) {
            this.props.setTheme(player.color);
        }
        this.setState({
            currentPlayer: player,
            playerAdded: true
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
        const { currentPlayer, roundDialogOpen, playerAdded } = this.state;
        const currentUserId: string = localStorage.getItem(SETTING_ID) || '';
        const isHost: boolean = !!currentUserId && game.host === currentUserId;
        let isInGame: boolean = false;
        const listOfPlayers = game.players.map(player => {
            if (player.id === currentUserId) {
                isInGame = true;
            } 
            return (
                <WordHint key={player.id} hint={player.name} color={player.color}></WordHint>
            )
        });
        isInGame = isInGame || !!playerAdded;
        const newPlayerName: string = !currentPlayer.name ? '?' : currentPlayer.name;
        const newPlayerColor: string = !currentPlayer.color ? getRandomColor() : currentPlayer.color;

        return (
            <div className="Game-lobby">
                <div className="New-player">
                    { 
                        isInGame ? (
                            <Paper className="StatusInfo">
                                <Trans i18nKey="GAME.LOBBY.WAIT_MESSAGE" tOptions={{context: isHost ? 'HOST' : 'PLAYER'}}>
                                    Warten auf Mitspieler ... Sobald alle Mitspieler da sind, kann der Spielleiter das Spiel starten.
                                </Trans> 
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
                                onClick={this.selectNumRounds}>
                                <Trans i18nKey="GAME.LOBBY.START_BUTTON">Alle Spieler sind da</Trans>
                            </Button>
                        )
                    }
                </div>
                <div className="Player-list">
                    <Typography variant="h5">
                        <Trans i18nKey="COMMON.TEAMMATES">Mitspieler</Trans>
                    </Typography>
                    {listOfPlayers}
                    {!isInGame && <WordHint hint={newPlayerName} color={newPlayerColor} showPencil={true}></WordHint>}
                </div>
                <RoundSelector numOfPlayers={game.players.length} open={roundDialogOpen} onClose={this.startPreparation}/>
            </div>
        );
    }

}