import React from 'react';
import { List, ListItem, ListItemText, DialogTitle, Dialog } from '@material-ui/core';
import { Trans } from 'react-i18next';

export interface SelectionDialogOption {
    val: string,
    tKey?: string,
    displayVal?: string
}

type SelectionDialogProps = {
    tKey: string,
    onClose: (value: string)=>void,
    selectedValue: string,
    possibleValues: SelectionDialogOption[],
    open: boolean
};

export class SelectionDialog extends React.Component<SelectionDialogProps> {
    render() {
        const { tKey, open, onClose, selectedValue, possibleValues } = this.props;

        const handleClose = () => {
            onClose(selectedValue);
        };

        const handleListItemClick = (value: string) => {
            onClose(value);
        };

        return (
            <Dialog onClose={handleClose} open={open}>
                <DialogTitle>
                    <Trans i18nKey={tKey}>Einstellung</Trans>
                </DialogTitle>
                <List>
                    {possibleValues.map((value: SelectionDialogOption) => (
                        <ListItem button onClick={() => handleListItemClick(value.val)} key={value.val} selected={selectedValue === value.val}>
                            <ListItemText primary={value.tKey ? <Trans i18nKey={value.tKey}>{value.val}</Trans> : (value.displayVal || value.val)} />
                        </ListItem>
                    ))}
                </List>
            </Dialog>
        );
    }
}
