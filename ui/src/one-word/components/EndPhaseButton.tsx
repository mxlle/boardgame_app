import React from "react";
import {Theme, withStyles, createStyles, WithStyles, Button, Grid} from "@material-ui/core";
import {Trans} from "react-i18next";
import i18n from "../../i18n";
import {getNameListString} from "../../shared/functions";

type EndPhaseButtonProps = {
    endPhase: () => void,
    actionMissingFrom: string[],
    show: boolean
} & WithStyles<typeof styles>;

const styles = (_theme: Theme) => createStyles({
    root: {

    },
});

class EndPhaseButton extends React.Component<EndPhaseButtonProps> {
    render() {
        const { show, endPhase, actionMissingFrom } = this.props;
        let playerList = getNameListString(actionMissingFrom);

        if (!show) {
            return null;
        }

        const confirmEndPhase = () => {
            if (window.confirm(i18n.t('GAME.COMMON.END_PHASE_CONFIRM', 'Wirklich diese Phase beenden'))) {
                endPhase();
            }
        };

        return (
            <Grid item xs={12}>
                <Button variant="outlined"
                        onClick={() => confirmEndPhase()}>
                    <Trans i18nKey="GAME.COMMON.END_PHASE" tOptions={{playerList}}>Phase beenden</Trans>
                </Button>
            </Grid>
        );
    }
}

export default withStyles(styles)(EndPhaseButton);
