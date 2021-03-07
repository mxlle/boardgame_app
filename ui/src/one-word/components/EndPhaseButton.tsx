import React from "react";
import {Theme, withStyles, createStyles, WithStyles, Button, Grid} from "@material-ui/core";
import {Trans, withTranslation, WithTranslation} from "react-i18next";
import {getNameListString} from "../../shared/functions";
import {IUser} from "../../types";

type EndPhaseButtonProps = {
    endPhase: () => void,
    actionRequiredFrom: IUser[],
    show: boolean
} & WithTranslation & WithStyles<typeof styles>;

const styles = (_theme: Theme) => createStyles({
    root: {
        opacity: 0.5
    },
});

class EndPhaseButton extends React.Component<EndPhaseButtonProps> {
    render() {
        const { show, endPhase, actionRequiredFrom, classes, i18n } = this.props;
        let playerList = getNameListString(actionRequiredFrom.map(p => p.name));

        if (!show) {
            return null;
        }

        const confirmEndPhase = () => {
            if (window.confirm(i18n.t('GAME.COMMON.END_PHASE_CONFIRM', 'Are you sure?'))) {
                endPhase();
            }
        };

        return (
            <Grid item xs={12} className={classes.root}>
                <Button variant="outlined" size="small"
                        onClick={() => confirmEndPhase()}>
                    <Trans i18nKey="GAME.COMMON.END_PHASE" tOptions={{playerList}}>Skip to next phase</Trans>
                </Button>
            </Grid>
        );
    }
}

export default withTranslation()(withStyles(styles)(EndPhaseButton));
