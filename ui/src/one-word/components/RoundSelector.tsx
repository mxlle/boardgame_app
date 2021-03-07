import React from 'react';
import { List, ListItem, ListItemText, DialogTitle, Dialog } from '@material-ui/core';
import { Trans } from 'react-i18next';

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

        const options = [];
        for (let i = 0; i < 3; i++) {
            const wordCount = i+1;
            const roundCount = wordCount*numOfPlayers;
            options.push(
                <ListItem button onClick={() => handleListItemClick(wordCount)} key={wordCount}>
                    <ListItemText 
                        primary={<Trans i18nKey="GAME.LOBBY.ROUND_SELECT.NUM" count={roundCount}>{{roundCount}} rounds</Trans>}
                        secondary={<Trans i18nKey="GAME.LOBBY.ROUND_SELECT.WORDS" count={wordCount}>{{wordCount}} words per player</Trans>} />
                </ListItem>
            );
        }

        return (
            <Dialog onClose={handleClose} open={open} disableBackdropClick>
                <DialogTitle>
                    <Trans i18nKey="GAME.LOBBY.ROUND_SELECT.HEADING">Set number of rounds</Trans>
                </DialogTitle>
                <List>
                    {options}
                </List>
            </Dialog>
        );
    }
}
