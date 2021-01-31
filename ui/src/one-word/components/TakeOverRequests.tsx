import React from 'react';
import {
    List,
    ListItem,
    ListItemText,
    Paper,
    Typography,
    Grid,
    ListItemSecondaryAction, IconButton
} from '@material-ui/core';
import { Trans } from 'react-i18next';
import {ITakeOverRequest} from "../../types";
import DeleteIcon from "@material-ui/icons/Delete";

type TakeOverRequestsProps = {
    takeOverRequests: ITakeOverRequest[],
    onAccept: (id: string)=>void,
    onDeny: (id: string)=>void
};

export class TakeOverRequests extends React.Component<TakeOverRequestsProps> {
    render() {
        const { takeOverRequests, onAccept, onDeny } = this.props;

        const accept = (id: string) => {
            onAccept(id);
        };

        const deny = (id: string) => {
            onDeny(id);
        };

        const entries = takeOverRequests.map(req => (
            <ListItem key={req.id}
                      onClick={() => accept(req.id)}
                      button
            >
                <ListItemText
                    id={req.id}
                    primary={`${req.newPlayer.name} wants to take over ${req.oldPlayerName || req.oldPlayerId}`}
                    secondary={req.accepted ? 'accepted' : (req.denied ? 'denied' : 'open')} // TODO
                />
                { !req.accepted && !req.denied && (
                    <ListItemSecondaryAction>
                        <IconButton onClick={() => deny(req.id)}>
                            <DeleteIcon/>
                        </IconButton>
                    </ListItemSecondaryAction>
                )}
            </ListItem>
        ));

        return (
            <Grid item xs={12}>
                <Paper>
                    <Typography variant="h5"><Trans i18nKey="GAME.TAKE_OVER_REQUESTS">Take over requests</Trans></Typography>
                    <List>
                        {entries}
                    </List>
                </Paper>
            </Grid>
        );
    }
}
