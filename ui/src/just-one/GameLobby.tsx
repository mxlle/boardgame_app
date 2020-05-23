import React from 'react';
import { IGame, IUser } from '../custom.d';
import { Button, Paper, Typography } from '@material-ui/core';
import ShareIcon from '@material-ui/icons/Share';
import { Trans } from 'react-i18next';
import i18n from '../i18n';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import { WordHint } from './components/WordHint';
import { NewPlayer } from '../common/NewPlayer';
import { RoundSelector } from './components/RoundSelector';
import { getRandomColor } from '../common/ColorPicker';

import { SETTING_ID, SETTING_NAME, SETTING_COLOR, DEFAULT_NUM_WORDS } from '../shared/constants';
import * as api from '../shared/apiFunctions';

type GameLobbyProps = {
    game: IGame,
    setTheme?: (color: string)=>void
}&WithSnackbarProps;

type GameLobbyState = {
    currentPlayer: IUser,
    roundDialogOpen: boolean,
    playerAdded?: boolean
};

class GameLobby extends React.Component<GameLobbyProps,GameLobbyState> {

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
        this.shareGame = this.shareGame.bind(this);
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

    shareGame() {
        const gameUrl = window.location.href;
        if (navigator.share) {
            navigator.share({
                title: document.title,
                text: i18n.t('GAME.LOBBY.INVITE_PLAYERS_MESSAGE', 'Spiele online mit mir'),
                url: gameUrl,
            })
            .catch(() => this.props.enqueueSnackbar(<Trans i18nKey="GAME.LOBBY.COPIED_LINK_ERROR">Fehler beim Link kopieren</Trans>, {variant: 'error'}));
        } else {
            try {
                navigator.clipboard.writeText(gameUrl);
                this.props.enqueueSnackbar(<Trans i18nKey="GAME.LOBBY.COPIED_LINK">Link kopiert</Trans>);
            } catch (e) {
                this.props.enqueueSnackbar(<Trans i18nKey="GAME.LOBBY.COPIED_LINK_ERROR">Fehler beim Link kopieren</Trans>, {variant: 'error'});
            }      
        }
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
                        isInGame && (
                            <Button variant="contained"
                                startIcon={<ShareIcon />}
                                onClick={this.shareGame}>
                                <Trans i18nKey="GAME.LOBBY.INVITE_PLAYERS">Personen einladen</Trans>
                            </Button>
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

export default withSnackbar(GameLobby);