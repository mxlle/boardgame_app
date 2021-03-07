import React from 'react';
import { Trans } from 'react-i18next';
import { IUser } from '../types';
import { Button } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import ColorPicker from '../common/ColorPicker';
import {createStyles, Theme, WithStyles, withStyles} from "@material-ui/core/styles";
import {STYLES} from "../theme";

const styles = (_theme: Theme) => createStyles({
    root: {
        ...STYLES.flexCenter,
        flexDirection: 'column'
    }
});

type NewPlayerProps = {
    addPlayer: (player: IUser) => void,
    updatePlayer: (player: IUser) => void,
    currentPlayer: IUser
}&WithStyles<typeof styles>;

class NewPlayer extends React.Component<NewPlayerProps> {

    constructor(props: NewPlayerProps) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.setColor = this.setColor.bind(this);
        this.addPlayer = this.addPlayer.bind(this);
    }

    handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.name === 'name') {
            this.props.currentPlayer.name = event.target.value;

            this.props.updatePlayer(this.props.currentPlayer);
        }
    }

    setColor(color: string) {
        this.props.currentPlayer.color = color;
        this.props.updatePlayer(this.props.currentPlayer);    
    }

    addPlayer() {
        this.props.addPlayer(this.props.currentPlayer);
    }

    render() {
        const { currentPlayer, classes } = this.props;

        return (
            <div className={classes.root}>
                <TextField className="name-input" required label={<Trans i18nKey="COMMON.PLAYER_NAME">Name</Trans>}
                    name='name'
                    value={currentPlayer.name} 
                    onChange={this.handleChange}/>
                <ColorPicker select={this.setColor} selected={currentPlayer.color}/>
                <Button variant="contained" color="primary" className="submitBtn"
                    disabled={!currentPlayer.name} 
                    onClick={this.addPlayer}><Trans i18nKey="GAME.LOBBY.JOIN">Join</Trans></Button>
            </div>
        );
    }

}

export default withStyles(styles)(NewPlayer);
