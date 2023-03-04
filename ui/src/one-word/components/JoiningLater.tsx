import React from 'react';
import {Button, Container, createStyles, Grid, Theme, withStyles, WithStyles} from '@material-ui/core';
import {GamePhase, IGame, IUser} from '../../types';

import api from '../../shared/apiFunctions';
import {getCurrentUserId, getCurrentUserInGame} from '../../shared/functions';
import {Trans, WithTranslation, withTranslation} from "react-i18next";
import {SETTING_COLOR, SETTING_ID, SETTING_NAME} from "../../shared/constants";
import JoiningRequests from "../components/JoiningRequests";
import {SelectionDialog, SelectionDialogOption} from "../../common/SelectionDialog";
import NewPlayer from "../../common/NewPlayer";
import {getRandomColor} from "../../shared/color-util";

const styles = (theme: Theme) => createStyles({
    button: {
        margin: theme.spacing(1),
        marginTop: theme.spacing(8),
        '&+$button': {
            marginTop: theme.spacing(1)
        }
    }
});

type JoiningLaterProps = {
    game: IGame,
    setTheme?: (color: string)=>void
}&WithTranslation&WithStyles<typeof styles>;
type JoiningLaterState = {
    currentPlayer: IUser,
    joinGameDialogOpen: boolean
};

class JoiningLater extends React.Component<JoiningLaterProps,JoiningLaterState> {
    public state: JoiningLaterState = {
        currentPlayer: {
            id: localStorage.getItem(SETTING_ID) || '',
            name: localStorage.getItem(SETTING_NAME) || '',
            color: localStorage.getItem(SETTING_COLOR) || ''
        },
        joinGameDialogOpen: false
    };
    private _isMounted: boolean = false;

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        const {game, setTheme, classes, i18n} = this.props;
        const {currentPlayer, joinGameDialogOpen} = this.state;

        if (game.$isTutorial || [GamePhase.Init, GamePhase.Preparation, GamePhase.End].includes(game.phase)) return null;

        let joiningRequests, joinButton;
        let joiningList: SelectionDialogOption[] = [];
        const currentUser = getCurrentUserInGame(game);

        const requestTakeOver = async (oldPlayerId?: string) => {
            if (oldPlayerId) {
                if (!currentPlayer.id) return;
                if (setTheme && currentPlayer.color) {
                    setTheme(currentPlayer.color);
                }
                try {
                    await api.requestJoining(game.id, oldPlayerId, currentPlayer);
                } catch(e) {
                    console.log(e);
                }
            }

            this.setState({
                joinGameDialogOpen: false
            });

        }

        const joinGame = (player: IUser = currentPlayer) => {
            if (player) {
                localStorage.setItem(SETTING_NAME, player.name);
                if (player.color) localStorage.setItem('playerColor', player.color);
            }
            this.setState({
                joinGameDialogOpen: true,
                currentPlayer: player
            });
        }

        if (!currentUser) {
            const requestedTakeOver = game.joiningRequests.findIndex(req => req.newPlayer.id === localStorage.getItem(SETTING_ID) && !req.denied && !req.accepted) > -1;
            const currentUserName = localStorage.getItem(SETTING_NAME) || '';
            let newPlayer: IUser = {
                color: getRandomColor(localStorage.getItem(SETTING_COLOR), game.players.map(p => p.color)),
                ...currentPlayer
            };

            joiningList = game.players.map(p => ({ val: p.id, displayVal: i18n.t('GAME.JOINING.REQUEST_TAKEOVER', { playerName: p.name })}));
            if (game.players.length > 3) {
                joiningList.unshift({
                    val: getCurrentUserId(),
                    displayVal: i18n.t('GAME.JOINING.NEW_PLAYER')
                })
            }

            joinButton = !!currentUserName ? (
                <Grid item xs={12} className={classes.button}>
                    <Button variant="outlined" onClick={() => joinGame()} disabled={requestedTakeOver}>
                        <Trans i18nKey={requestedTakeOver ? 'GAME.JOINING.REQUESTED_JOIN' : 'GAME.LOBBY.JOIN'}>Join</Trans>
                    </Button>
                </Grid>
            ) : (
                <Grid item xs={12} className={classes.button}>
                    <NewPlayer currentPlayer={newPlayer}
                               addPlayer={(player) => joinGame(player)}
                               updatePlayer={(player) => { this.setState({ currentPlayer: player })}}/>
                </Grid>
            );
        } else if (game.joiningRequests.length) {
            const filteredTakeOverRequests = game.joiningRequests.filter(req => [game.hostId, req.oldPlayerId].includes(currentUser.id));
            const onRequestAccept = (id: string) => {
                api.handleJoining(game.id, id);
            };
            const onRequestDeny = (id: string) => {
                api.handleJoining(game.id, id, true);
            };
            joiningRequests = filteredTakeOverRequests.length > 0 && (
                <JoiningRequests takeOverRequests={filteredTakeOverRequests} onAccept={onRequestAccept} onDeny={onRequestDeny}/>
            );
        }

        if (!joinButton && !joiningRequests) return null;

        return (
            <Container>
                {joiningRequests}
                {joinButton}
                {!currentUser && <SelectionDialog
                    tKey="GAME.LOBBY.JOIN"
                    open={joinGameDialogOpen}
                    onClose={(playerId: string) => { requestTakeOver(playerId); }}
                    selectedValue={''}
                    possibleValues={joiningList}
                />}
            </Container>
        );
    }
}

export default withTranslation()(withStyles(styles)(JoiningLater));
