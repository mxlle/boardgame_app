import React from 'react';
import { withTheme, WithTheme } from '@material-ui/core/styles';
import ReactJoyride, {StoreHelpers} from "react-joyride";
import {IGame} from "../types";
import {getCurrentTutorialSteps} from "../one-word/tutorial";
import {Trans} from "react-i18next";

type TutorialOverlayProps = {
    game: IGame;
    getHelpers?: (helpers: StoreHelpers)=>void;
}&WithTheme;

class TutorialOverlay extends React.Component<TutorialOverlayProps> {

    render() {
        const { game, getHelpers, theme } = this.props;

        if (!game.$isTutorial) return null;

        const joyrideSteps = getCurrentTutorialSteps(game);

        return (
            <ReactJoyride
                steps={joyrideSteps}
                styles={{
                    options: {
                        primaryColor: theme.palette.primary.main,
                        backgroundColor: theme.palette.background.paper,
                        arrowColor: theme.palette.background.paper,
                        textColor: theme.palette.text.primary,
                        overlayColor: theme.palette.action.disabled,
                        spotlightShadow: theme.shadows[8],
                        zIndex: 100
                    }
                }}
                locale={{
                    back:  <Trans i18nKey="TUTORIAL.CONTROLS.BACK" defaultValue="Back"/>,
                    close: <Trans i18nKey="TUTORIAL.CONTROLS.CLOSE" defaultValue="Close"/>,
                    last:  <Trans i18nKey="TUTORIAL.CONTROLS.DONE" defaultValue="Done"/>,
                    next:  <Trans i18nKey="TUTORIAL.CONTROLS.NEXT" defaultValue="Next"/>,
                    skip:  <Trans i18nKey="TUTORIAL.CONTROLS.SKIP" defaultValue="Skip"/>
                }}
                getHelpers={getHelpers}
                continuous spotlightClicks
            />
        );
    }

}

export default withTheme(TutorialOverlay);