import React from 'react';
import {DEFAULT_NUM_WORDS, IGame, IUser} from '../types';
import {Box, Button, Grid, IconButton, Paper, Tooltip, Typography} from '@material-ui/core';
import DeleteIcon from "@material-ui/icons/Delete";
import ShareIcon from '@material-ui/icons/Share';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import LooksTwoIcon from '@material-ui/icons/LooksTwo';
import HelpIcon from '@material-ui/icons/HelpOutline';
import SentimentSatisfiedAltIcon from '@material-ui/icons/SentimentSatisfiedAlt';
import {Trans, WithTranslation, withTranslation} from 'react-i18next';
import {withSnackbar, WithSnackbarProps} from 'notistack';
import WordHint from './components/WordHint';
import NewPlayer from '../common/NewPlayer';
import {RoundSelector} from './components/RoundSelector';

import {SETTING_COLOR, SETTING_ID, SETTING_NAME} from '../shared/constants';
import api from '../shared/apiFunctions';
import {addPlayerToTutorial, nextTutorialStep} from "./tutorial";
import TutorialOverlay from "../common/TutorialOverlay";
import {OneWordGameChildProps} from "./OneWordGame";
import {createStyles, Theme, WithStyles, withStyles} from "@material-ui/core/styles";
import {getRandomColor} from "../shared/color-util";
import {getOpenAiKey, setOpenAiKey} from "../shared/functions";


const styles = (theme: Theme) => createStyles({
    fakeDisabled: {
        color: theme.palette.action.disabled,
        backgroundColor: theme.palette.action.disabledBackground,
        boxShadow: 'none',
        '&:hover': {
            color: theme.palette.action.disabled,
            backgroundColor: theme.palette.action.disabledBackground,
            boxShadow: 'none',
            cursor: 'default'
        }
    },
    marginLeft: {
        marginLeft: theme.spacing(1)
    }
});

type GameLobbyProps = {
    game: IGame,
    setTheme?: (color: string)=>void
}&WithTranslation&WithSnackbarProps&OneWordGameChildProps&WithStyles<typeof styles>;

type GameLobbyState = {
    currentPlayer: IUser,
    roundDialogOpen: boolean,
    isTwoPlayerVariant?: boolean
};

class GameLobby extends React.Component<GameLobbyProps,GameLobbyState> {

    constructor(props: GameLobbyProps) {
        super(props);

        this.state = {
            currentPlayer: {
                id: localStorage.getItem(SETTING_ID) || '',
                name: localStorage.getItem(SETTING_NAME) || '',
                color: getRandomColor(localStorage.getItem(SETTING_COLOR), props.game.players.map(p => p.color))
            },
            roundDialogOpen: false,
        }

        this.addPlayer = this.addPlayer.bind(this);
        this.addAiPlayer = this.addAiPlayer.bind(this);
        this.leaveGame = this.leaveGame.bind(this);
        this.setPlayerProps = this.setPlayerProps.bind(this);
        this.selectNumRounds = this.selectNumRounds.bind(this);
        this.startPreparation = this.startPreparation.bind(this);
        this.shareGame = this.shareGame.bind(this);
        this.activateAi = this.activateAi.bind(this);
    }

    setPlayerProps(player: IUser) {
        this.setState({
            currentPlayer: player
        });
    }

    async addPlayer(player: IUser) {
        if (this.props.game.$isTutorial) { addPlayerToTutorial(player); this.setLocalPlayer(player); return; }
        await api.addPlayer(this.props.game.id, player);
        this.setLocalPlayer(player);
    }

    addAiPlayer() {
        void api.addAiPlayer(this.props.game.id);
    }

    setLocalPlayer(player: IUser) {
        localStorage.setItem(SETTING_ID, player.id);
        localStorage.setItem(SETTING_NAME, player.name);
        if (player.color) localStorage.setItem('playerColor', player.color);
        if (this.props.setTheme && player.color) {
            this.props.setTheme(player.color);
        }
        const name = player.name;
        this.props.enqueueSnackbar(
            <Box display="flex" alignItems="center">
                <Box mr={1}><SentimentSatisfiedAltIcon/></Box>
                <Trans i18nKey="COMMON.WELCOME_NAME">Hello {{ name }}</Trans>
            </Box>, {});
        this.setState({
            currentPlayer: player
        });
    }

    leaveGame(playerId: string = this.state.currentPlayer.id) {
        void api.removePlayerFromGame(this.props.game.id, playerId);
    }

    selectNumRounds(isTwoPlayerVariant: boolean = false) {
        if (this.props.game.$isTutorial) { nextTutorialStep(); return; }

        this.setState({
            roundDialogOpen: true,
            isTwoPlayerVariant: isTwoPlayerVariant
        });
    }

    async startPreparation(wordsPerPlayer: number = DEFAULT_NUM_WORDS) {
        this.setState({
            roundDialogOpen: false
        });

        await api.startPreparation(this.props.game.id, wordsPerPlayer, this.state.isTwoPlayerVariant);
    }

    shareGame() {
        const gameUrl = window.location.href;
        if (navigator.share) {
            navigator.share({
                title: document.title || this.props.i18n.t('APP_TITLE', 'Just one word!'),
                text: this.props.i18n.t('GAME.LOBBY.INVITE_PLAYERS_MESSAGE', 'Play online'),
                url: gameUrl,
            });
        } else {
            try {
                navigator.clipboard.writeText(gameUrl);
                this.props.enqueueSnackbar(<Trans i18nKey="GAME.LOBBY.COPIED_LINK">Copied</Trans>);
            } catch (e) {
                this.props.enqueueSnackbar(<Trans i18nKey="GAME.LOBBY.COPIED_LINK_ERROR">Error copying</Trans>, {variant: 'error'});
            }      
        }
    }

    async activateAi() {
        const key = window.prompt(this.props.i18n.t('AI.ACTIVATION.PROMPT', 'Please enter your OpenAI API key or the secret password'), getOpenAiKey() ?? '');
        if (key) {
            const isValidCheck = await api.setOpenAiKey(this.props.game.id, key);
            if (isValidCheck === true) {
                setOpenAiKey(key);
                this.props.enqueueSnackbar(this.props.i18n.t('AI.ACTIVATION.SUCCESS', 'AI successfully activated'), {variant: 'success'});
            } else {
                this.props.enqueueSnackbar(isValidCheck, {variant: 'error'});
            }
        }
    }

    render() {
        const { game, classes } = this.props;
        const { currentPlayer, roundDialogOpen } = this.state;
        const currentUserId: string = localStorage.getItem(SETTING_ID) || '';
        const isHost: boolean = !!currentUserId && game.hostId === currentUserId;
        let isInGame: boolean = false;
        const listOfPlayers = game.players.map(player => {
            if (player.id === currentUserId) {
                isInGame = true;
            } 
            return (
                <WordHint key={player.id} hint={player.name} color={player.color}>
                    {isHost && !game.$isTutorial && (
                        <IconButton
                            onClick={ ()=>this.leaveGame(player.id) }>
                            <DeleteIcon />
                        </IconButton>
                    )}
                </WordHint>
            )
        });
        const newPlayerName: string = !currentPlayer.name ? '?' : currentPlayer.name;
        const newPlayerColor: string = !currentPlayer.color ? getRandomColor() : currentPlayer.color;

        return (
            <Grid container spacing={4} className="Game-lobby">
                <Grid item xs={12} sm={6} container spacing={2} className="New-player">
                    { 
                        isInGame ? (
                            <Grid item xs={12}>
                                <Paper className="StatusInfo">
                                    <Trans i18nKey="GAME.LOBBY.WAIT_MESSAGE" tOptions={{context: isHost ? 'HOST' : 'PLAYER'}}>
                                        Waiting for teammates
                                    </Trans> 
                                </Paper>
                            </Grid>
                        ) : (
                            <Grid item xs={12}>
                                <NewPlayer currentPlayer={currentPlayer}
                                    updatePlayer={this.setPlayerProps}
                                    addPlayer={this.addPlayer}/>
                            </Grid>
                        )
                    }
                    {
                        isInGame && !game.$isTutorial && (
                            <Grid item xs={12}>
                                <Button variant="outlined"
                                    startIcon={<ShareIcon />}
                                    onClick={this.shareGame}>
                                    <Trans i18nKey="GAME.LOBBY.INVITE_PLAYERS">Share</Trans>
                                </Button>
                                <br/>
                                <Button variant="outlined"
                                        startIcon={<ArrowBackIcon />}
                                        onClick={()=>this.leaveGame()}>
                                    <Trans i18nKey="COMMON.BACK">Back</Trans>
                                </Button>
                            </Grid>
                        )
                    }
                    {
                        isHost && isInGame && (
                            <Grid item xs={12}>
                                {game.openAiKey ?
                                    (<Button variant="contained" onClick={this.addAiPlayer}>
                                        <Trans i18nKey="AI.ADD_PLAYER">Add AI player</Trans>
                                    </Button>)
                                :
                                    (<Button variant="contained" onClick={this.activateAi}>
                                        <Trans i18nKey="AI.ACTIVATION.BUTTON">Activate AI</Trans>
                                    </Button>)
                                }
                            </Grid>
                        )
                    }
                    {
                        isHost && isInGame && (
                            <Grid item xs={12}>
                                <Button variant="contained" color="primary" className={game.players.length === 2 ? `submitBtn ${classes.fakeDisabled}` : 'submitBtn'}
                                    disabled={game.players.length < 2}
                                    onClick={() => this.selectNumRounds(false)}>
                                    <Trans i18nKey="GAME.LOBBY.START_BUTTON">Start</Trans>
                                </Button>
                            </Grid>
                        )
                    }
                </Grid>
                <Grid item xs={12} sm={6} container spacing={2} alignItems="center" className="Player-list">
                    <Grid item xs={12} component={Typography} variant="h5">
                        <Trans i18nKey="COMMON.TEAMMATES">Teammates</Trans>
                    </Grid>
                    {listOfPlayers}
                    {!isInGame && <WordHint hint={newPlayerName} color={newPlayerColor} showPencil={true} />}
                    {
                        isHost && isInGame && !game.$isTutorial && game.players.length === 2 && (
                            <Grid item xs={12} container>
                                <Button variant="outlined"
                                        startIcon={<LooksTwoIcon />}
                                        onClick={() => this.selectNumRounds(true)}>
                                    <Trans i18nKey="GAME.LOBBY.START_TWO_PLAYERS">Two player variant</Trans>
                                </Button>
                                <Tooltip title={<div style={{whiteSpace: 'pre'}}><Trans i18nKey="GAME.LOBBY.START_TWO_PLAYERS_DESCRIPTION"/></div>}>
                                    <HelpIcon className={classes.marginLeft}/>
                                </Tooltip>
                            </Grid>
                        )
                    }
                </Grid>
                <RoundSelector numOfPlayers={game.players.length} open={roundDialogOpen} onClose={this.startPreparation}/>
                <TutorialOverlay key={isInGame ? '1' : '2'} game={game} />
            </Grid>
        );
    }

}

export default withTranslation()(withStyles(styles)(withSnackbar(GameLobby)));
