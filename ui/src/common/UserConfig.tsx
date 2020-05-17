import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';

type UserConfigProps = {
  onClose: (value: string)=>void,
  selectedValue: string,
  possibleValues: string[],
  open: boolean
};

export class UserConfig extends React.Component<UserConfigProps> {
  render() {
    const { open, onClose, selectedValue, possibleValues } = this.props;

    const handleClose = () => {
      onClose(selectedValue);
    };

    const handleListItemClick = (value: string) => {
      onClose(value);
    };

    return (
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>Nachtmodus</DialogTitle>
        <List>
          {possibleValues.map((value: string) => (
            <ListItem button onClick={() => handleListItemClick(value)} key={value} selected={selectedValue === value}>
              <ListItemText primary={value} />
            </ListItem>
          ))}
        </List>
      </Dialog>
    );
  }
}