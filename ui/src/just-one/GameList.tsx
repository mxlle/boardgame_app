import React from 'react';
import { Link } from 'react-router-dom';
import { 
    List, 
    ListItem, 
    ListItemText, 
    ListItemSecondaryAction, 
    IconButton,
    Paper,
    Typography
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { Trans } from 'react-i18next';
import { IGame, GamePhase } from '../custom.d';

import { SETTING_ID, SETTING_NAME } from '../shared/constants';
import { getCurrentUserInGame } from '../shared/functions';

type GameListProps = {
    allGames: IGame[],
    deleteGame: (gameId:string)=>void,
};

type GameListState = {
}

export class GameList extends React.Component<GameListProps,GameListState> {
    public currentUserId: string = localStorage.getItem(SETTING_ID) || '';
    public currentUserName: string = localStorage.getItem(SETTING_NAME) || '';

    render() {
        const {allGames,deleteGame} = this.props;
        const newGames = allGames.filter(game => game.phase === GamePhase.Init && !getCurrentUserInGame(game));
        const onGoingGames = allGames.filter(game => 
            ![GamePhase.Init,GamePhase.End].includes(game.phase) || (game.phase === GamePhase.Init && !!getCurrentUserInGame(game))
        );
        const doneGames = allGames.filter(game => game.phase === GamePhase.End);

        const createListItem = (game: IGame) => {
            const playersString = game.players.map(p => p.name).join(', ') || '-';

            return (
                <ListItem key={game.id} className="GameListItem"
                    {...{ to: `/${game.id}` }}
                    component={Link}
                    button
                >
                    <ListItemText 
                        id={game.id} 
                        primary={`${game.name || game.id}`}
                        secondary={<Trans i18nKey="HOME.GAME_LIST.PLAYERS">Spieler: {{playersString}}</Trans>} 
                    />
                    {
                        this.currentUserId === game.host && (
                            <ListItemSecondaryAction>
                                <IconButton onClick={() => deleteGame(game.id)}>
                                    <DeleteIcon/>
                                </IconButton>
                            </ListItemSecondaryAction>
                        )
                    }
                </ListItem>
            );
        }

        const newGamesList = newGames.map(createListItem);
        const onGoingGamesList = onGoingGames.map(createListItem);
        const doneGamesList = doneGames.map(createListItem);

        return (
            <div className="GameList">
                {
                    onGoingGamesList.length > 0 && (
                        <Paper>
                            <Typography variant="h5"><Trans i18nKey="HOME.GAME_LIST.ONGOING">Meine laufenden Spiele</Trans></Typography>
                            <List>
                                {onGoingGamesList}
                            </List> 
                        </Paper>
                    )
                }
                {
                    newGamesList.length > 0 && (
                        <Paper>
                            <Typography variant="h5"><Trans i18nKey="HOME.GAME_LIST.NEW">Neue Spiele</Trans></Typography>
                            <List>
                                {newGamesList}
                            </List> 
                        </Paper>
                    )
                }
                {
                    doneGamesList.length > 0 && (
                        <Paper>
                            <Typography variant="h5"><Trans i18nKey="HOME.GAME_LIST.DONE">Meine beendeten Spiele</Trans></Typography>
                            <List>
                                {doneGamesList}
                            </List> 
                        </Paper>
                    )
                }
            </div>
        );
    }
}

/*
TODO Share Button

import ShareIcon from '@material-ui/icons/Share';
import {AlertBar} from '../common/AlertBar';

    public state: GameListState = {
        showAlert: false,
        alertText: ''
    }
        const {showAlert,alertText} = this.state;

        const shareGame = (gameId: string) => {
            const gameUrl = `${window.location.protocol}//${window.location.host}/${gameId}`;
            navigator.clipboard.writeText(gameUrl);
            this.setState({
                showAlert: true,
                alertText: `Link zum Spiel wurde in die Zwischenablage kopiert`
            });
        }

        const hideAlert = ()=> {
            this.setState({
                showAlert: false,
                alertText: ``
            });
        }

                    {
                        game.phase === GamePhase.Init && (
                            <ListItemSecondaryAction>
                                <IconButton onClick={() => shareGame(game.id)}>
                                    <ShareIcon/>
                                </IconButton>
                            </ListItemSecondaryAction>
                        )
                    }

                <AlertBar show={showAlert} alertText={alertText} onClose={hideAlert}/>
*/