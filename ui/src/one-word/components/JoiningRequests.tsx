import React from 'react';
import {
    List,
    ListItem,
    ListItemText,
    Typography,
    Grid,
    ListItemSecondaryAction, IconButton
} from '@material-ui/core';
import {createStyles, Theme, withStyles, WithStyles} from "@material-ui/core/styles";
import { Trans } from 'react-i18next';
import {IJoiningRequest} from "../../types";
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import DeleteIcon from "@material-ui/icons/Delete";

const styles = (theme: Theme) => createStyles({
    root: {
        margin: theme.spacing(4),
        padding: theme.spacing(2)
    },
    secondaryAction: {
        marginRight: theme.spacing(-2)
    }
});

type JoiningRequestsProps = {
    takeOverRequests: IJoiningRequest[],
    onAccept: (id: string)=>void,
    onDeny: (id: string)=>void
}&WithStyles<typeof styles>;

class JoiningRequests extends React.Component<JoiningRequestsProps> {
    render() {
        const { takeOverRequests, onAccept, onDeny, classes } = this.props;

        const accept = (id: string) => {
            onAccept(id);
        };

        const deny = (id: string) => {
            onDeny(id);
        };

        const entries = takeOverRequests.map(req => {
            const newPlayerName = req.newPlayer.name;
            const oldPlayerName = req.oldPlayerName;
            const requestDescription = req.joinAsNewPlayer ?
                <Trans i18nKey="GAME.JOINING.JOIN_AS_NEW">{{newPlayerName}} wants to join</Trans> :
                <Trans i18nKey="GAME.JOINING.TAKEOVER_REQUEST">{{newPlayerName}} wants to take over {{oldPlayerName}}</Trans>;
            const state = <Trans i18nKey={req.accepted ? 'GAME.JOINING.ACCEPTED' : (req.denied ? 'GAME.JOINING.DENIED' : 'GAME.JOINING.OPEN')}>open</Trans>;
            return (
                <ListItem key={req.id}
                          disabled={req.accepted || req.denied}
                          onClick={() => accept(req.id)}
                          button
                >
                    <ListItemText
                        id={req.id}
                        primary={requestDescription}
                        secondary={state}
                    />
                    <ListItemSecondaryAction className={classes.secondaryAction}>
                        <IconButton onClick={() => deny(req.id)}>
                            { !req.accepted && !req.denied ? <HighlightOffIcon/> : <DeleteIcon/>}
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
            )
        });

        return (
            <Grid item xs={12} className={classes.root}>
                <Typography variant="h5"><Trans i18nKey="GAME.JOINING.REQUESTS">Joining requests</Trans></Typography>
                <List>
                    {entries}
                </List>
            </Grid>
        );
    }
}

export default withStyles(styles)(JoiningRequests);
