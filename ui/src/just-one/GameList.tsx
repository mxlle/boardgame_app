import React from 'react';
import { Link } from 'react-router-dom';
import { 
    Grid,
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

        const categories = [
            { key: 'ongoing', elementList: onGoingGamesList, heading: <Trans i18nKey="HOME.GAME_LIST.ONGOING">Meine laufenden Spiele</Trans> },
            { key: 'new', elementList: newGamesList, heading: <Trans i18nKey="HOME.GAME_LIST.NEW">Neue Spiele</Trans> },
            { key: 'done', elementList: doneGamesList, heading: <Trans i18nKey="HOME.GAME_LIST.DONE">Meine beendeten Spiele</Trans> },
        ];

        const content = categories.filter(category => category.elementList.length > 0).map((category, index) => (
            <Grid item xs={12} key={category.key}>
                <Paper>
                    <Typography variant="h5">{category.heading}</Typography>
                    <List>
                        {category.elementList}
                    </List> 
                </Paper>
            </Grid>
        ));

        return (
            <Grid container spacing={2} className="GameList">
                {content}
            </Grid>
        );
    }
}
