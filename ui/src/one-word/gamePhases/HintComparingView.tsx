import React from 'react';
import { Trans } from 'react-i18next';
import i18n from '../../i18n';
import {Grid, Button, Typography, Checkbox} from '@material-ui/core';
import {IGame, IHint} from '../../types';
import WordCard from '../components/WordCard';
import WordHint from '../components/WordHint';
import GameField from './GameField';

import api from '../../shared/apiFunctions';
import {getPlayerInGame} from "../gameFunctions";
import {getCurrentUserInGame} from "../../shared/functions";
import {nextTutorialStep, toggleDuplicateInTutorial} from "../tutorial";
import TutorialOverlay from "../../common/TutorialOverlay";
import {OneWordGameChildProps} from "../OneWordGame";
import {Mood as MoodIcon, MoodBad as MoodBadIcon} from "@material-ui/icons";
import EndPhaseButton from "../components/EndPhaseButton";

type HintComparingViewProps = {
    game: IGame
}&OneWordGameChildProps;

type HintComparingViewState = {};

class HintComparingView extends React.Component<HintComparingViewProps,HintComparingViewState> {
    private _isMounted: boolean = false;

    constructor(props: HintComparingViewProps) {
        super(props);

        this.toggleDuplicate = this.toggleDuplicate.bind(this);
        this.showHints = this.showHints.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    async toggleDuplicate(hintId: string) {
        if (this.props.game.$isTutorial) { toggleDuplicateInTutorial(this.props.game, hintId); return; }
        await api.toggleDuplicateHint(this.props.game.id, hintId);
    }

    async showHints() {
        if (this.props.game.$isTutorial) { nextTutorialStep(); return; }
        await api.showHints(this.props.game.id);
    }

    render() {
        const game: IGame = this.props.game;
        const currentRound = game.rounds[game.round];
        const currentUser = getCurrentUserInGame(game);
        const guesser = getPlayerInGame(game, currentRound.guesserId) || { name: '?', id: '?' };
        const isGuesser = currentUser && currentUser.id === guesser.id;
        const guesserName = guesser.name;
        const roundHost = getPlayerInGame(game, currentRound.hostId) || { name: '?', id: '?' };
        const isRoundHost = currentUser && currentUser.id === roundHost.id;
        const isGameHost: boolean = !!currentUser?.id && game.hostId === currentUser.id;

        const currentWord = isGuesser || !currentUser ? '?' : (currentRound.word || '');
        const currentHints = currentRound.hints.map((hintObj: IHint) => {
            const hintIsMine = currentUser && currentUser.id === hintObj.authorId;
            const author = getPlayerInGame(game, hintObj.authorId) || { name: '?', id: '?' };
            const authorName = hintIsMine ? i18n.t('COMMON.ME', 'Ich') : author.name;

            return (
                <WordHint 
                    key={hintObj.id}
                    hint={hintObj.hint}
                    color={author.color}
                    showCheck={isGuesser||!currentUser}
                    showCross={(isGuesser||!currentUser)&&hintObj.isDuplicate}
                    duplicate={hintObj.isDuplicate}
                    author={authorName}
                >
                    {isRoundHost && (
                        <Checkbox
                            icon={<MoodIcon />} checkedIcon={<MoodBadIcon />}
                            checked={hintObj.isDuplicate || false}
                            onChange={ ()=>this.toggleDuplicate(hintObj.id) }/>
                    )}
                </WordHint>
            );
        });

        if (isRoundHost) { // TODO - maybe not use Grid for these elements (?)
            currentHints.push((
                <Grid item xs={12} component={Typography} variant="subtitle1" key="info">
                    <Trans i18nKey="GAME.COMPARING.INFO">Markiere ungültige Hinweise</Trans>
                </Grid>
            ),(
                <Grid item xs={12} key="button">
                    <Button variant="contained" color="primary" onClick={this.showHints} className="submitBtn">
                        <Trans i18nKey="GAME.COMPARING.BUTTON">{{guesserName}} kann losraten!</Trans>
                    </Button>
                </Grid>
            ));
        }

        return (
            <GameField
                leftCol={[
                    (<WordCard
                        word={currentWord} 
                        guesser={guesser}
                        isGuesser={isGuesser}
                        key="1" />),
                    (<EndPhaseButton
                        show={isGameHost && !isRoundHost && !game.isTwoPlayerVariant && !game.$isTutorial}
                        endPhase={() => this.showHints()}
                        actionRequiredFrom={game.actionRequiredFrom}
                        key="2"/>),
                    game.$isTutorial && game.round === 1 ? (<Button onClick={() => {nextTutorialStep();}} className="tutorialBtn" key="tutorialBtn">
                        <Trans i18nKey="TUTORIAL.CONTINUE">Continue</Trans>
                    </Button>) : <span/>,
                    <TutorialOverlay game={game} key="tutorial" />
                ]}

                rightCol={currentHints}
            />
        );
    }
}

export default HintComparingView;
