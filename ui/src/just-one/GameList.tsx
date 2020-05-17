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
import { IGame, GamePhase } from '../custom.d';

import { SETTING_ID, SETTING_NAME } from '../App';

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
    const newGames = allGames.filter(game => game.phase === GamePhase.Init);
    const onGoingGames = allGames.filter(game => ![GamePhase.Init,GamePhase.End].includes(game.phase));
    const doneGames = allGames.filter(game => game.phase === GamePhase.End);

    const createListItem = (game: IGame) => {
      return (
        <ListItem key={game.id} className="GameListItem"
          {...{ to: `/${game.id}` }}
          component={Link}
          button
        >
          <ListItemText id={game.id} primary={`${game.name || game.id}`} secondary={`Spieler: ${game.players.map(p => p.name).join(', ') || '-'}`} />
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
              <Typography variant="h5">Meine laufenden Spiele</Typography>
              <List>
                {onGoingGamesList}
              </List> 
            </Paper>
          )
        }
        {
          newGamesList.length > 0 && (
            <Paper>
              <Typography variant="h5">Neue Spiele</Typography>
              <List>
                {newGamesList}
              </List> 
            </Paper>
          )
        }
        {
          doneGamesList.length > 0 && (
            <Paper>
              <Typography variant="h5">Meine beendeten Spiele</Typography>
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