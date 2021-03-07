import React, {ReactElement} from 'react';
import { Trans } from 'react-i18next';
import { Grid, Typography } from '@material-ui/core';

type GameFieldProps = {
    leftCol: ReactElement|ReactElement[];
    rightCol: ReactElement|ReactElement[];
};

class GameField extends React.Component<GameFieldProps> {

    render() {

        return (
            <Grid container spacing={4} className="Game-field">
                <Grid item xs={12} md={5} container spacing={2} className="Current-word">
                    <Grid item xs={12} component={Typography} variant="h5">
                        <Trans i18nKey="GAME.COMMON.WORD">Word</Trans>
                    </Grid>
                    {this.props.leftCol}
                </Grid>
                <Grid item xs={12} md={7} container spacing={2} className="Current-hints">
                    <Grid item xs={12} component={Typography} variant="h5">
                        <Trans i18nKey="GAME.COMMON.PLAYER_HINTS">Hints</Trans>
                    </Grid>
                    {this.props.rightCol}
                </Grid>
            </Grid>
        );
    }
}

export default GameField;
