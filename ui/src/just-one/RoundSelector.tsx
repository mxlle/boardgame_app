import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';

type RoundSelectorProps = {
  onClose: (value?: number)=>void,
  numOfPlayers: number,
  open: boolean
};

export class RoundSelector extends React.Component<RoundSelectorProps> {
  render() {
    const { open, onClose, numOfPlayers } = this.props;

    const handleClose = () => {
      onClose();
    };

    const handleListItemClick = (value: number) => {
      onClose(value);
    };

    return (
      <Dialog onClose={handleClose} open={open} disableBackdropClick>
        <DialogTitle>Lege die Rundenanzahl fest</DialogTitle>
        <List>
          <ListItem button onClick={() => handleListItemClick(1)}>
            <ListItemText 
              primary={numOfPlayers + ' Runden'}
              secondary="1 Begriff pro Spieler"/>
          </ListItem>
          <ListItem button onClick={() => handleListItemClick(2)}>
            <ListItemText 
              primary={2*numOfPlayers + ' Runden'}
              secondary="2 Begriffe pro Spieler"/>
          </ListItem>   
          <ListItem button onClick={() => handleListItemClick(3)}>
            <ListItemText 
              primary={3*numOfPlayers + ' Runden'}
              secondary="3 Begriffe pro Spieler"/>
          </ListItem>
        </List>
      </Dialog>
    );
  }
}