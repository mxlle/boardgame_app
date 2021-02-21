import React from 'react';
import { Trans } from 'react-i18next';
import { IGame, DEFAULT_NUM_WORDS } from '../types';
import {Box, Button, Grid, IconButton, Paper, Typography} from '@material-ui/core';
import WordHint from './components/WordHint';
import WordCard from './components/WordCard';
import { WordAdder } from './components/WordAdder';

import { SETTING_ID } from '../shared/constants';
import api from '../shared/apiFunctions';
import {nextTutorialStep, TUTORIAL_WORDS} from "./tutorial";
import TutorialOverlay from "../common/TutorialOverlay";
import {OneWordGameChildProps} from "./OneWordGame";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import EditIcon from "@material-ui/icons/Edit";
import {getCurrentUserInGame} from "../shared/functions";

type GamePreparationProps = {
    game: IGame
}&OneWordGameChildProps;

type GamePreparationState = {
    submittedWords: string[];
    resetWords: boolean
}

export class GamePreparation extends React.Component<GamePreparationProps,GamePreparationState> {

    constructor(props: GamePreparationProps) {
        super(props);

        this.addWords = this.addWords.bind(this);
        this.resetWords = this.resetWords.bind(this);
        this.backToLobby = this.backToLobby.bind(this);

        const player = getCurrentUserInGame(props.game);
        this.state = { submittedWords: player?.enteredWords?.slice(0, props.game.wordsPerPlayer) || [], resetWords: false };
    }

    async addWords(words: string[]) {
        if (this.props.game.$isTutorial) { nextTutorialStep(); return; }

        const player = getCurrentUserInGame(this.props.game);
        if (!player) return;

        player.enteredWords = words;
        this.setState({
            submittedWords: words,
            resetWords: false
        });

        await api.updatePlayer(this.props.game.id, player);
    }

    backToLobby() {
        api.backToLobby(this.props.game.id);
    }

    resetWords() {
        const player = getCurrentUserInGame(this.props.game);
        if (!player) return;

        this.setState({
            submittedWords: player.enteredWords || [],
            resetWords: true
        });

        player.enteredWords = [];

        api.updatePlayer(this.props.game.id, player);
    }

    render() {
        const { game } = this.props;
        const { submittedWords, resetWords } = this.state;
        const numWordsPerPlayer = game.wordsPerPlayer || DEFAULT_NUM_WORDS;
        const currentUserId: string = localStorage.getItem(SETTING_ID) || '';
        const isHost: boolean = !!currentUserId && game.hostId === currentUserId;
        let isInGame: boolean = false;
        let myWords: string[] = [];
        let allMyWordsEntered: boolean = false;
        const listOfPlayers = game.players.map(player => {
            const wordsEntered: boolean = !!player.enteredWords && player.enteredWords.length === numWordsPerPlayer;
            if (player.id === currentUserId) {
                isInGame = true;
                myWords = player.enteredWords || submittedWords;
                allMyWordsEntered = wordsEntered || (!resetWords && myWords.length === numWordsPerPlayer);
            } 
            return (
                <WordHint key={player.id} hint={player.name} color={player.color} showPencil={!wordsEntered} />
            )
        });

        let defaultValues: string[] = submittedWords;
        if (game.$isTutorial) defaultValues = [TUTORIAL_WORDS[0]];

        const myWordCards = myWords.map(word => <WordCard key={word} small word={word} />)

        // TODO css classes
        return (
            <Grid container spacing={4} className="Game-lobby">
                <Grid item xs={12} sm={6} container spacing={2} className="New-player">
                    { 
                        allMyWordsEntered || !isInGame ? (
                            <Grid item xs={12}> 
                                <Paper className="StatusInfo">
                                    <Trans i18nKey="GAME.PREP.WAIT_MESSAGE">Warten auf Mitspieler ... Sobald alle fertig sind, geht's los.</Trans>
                                </Paper>
                            </Grid>
                        ) : (
                            <Grid item xs={12}>
                                <WordAdder
                                    add={this.addWords}
                                    numOfWords={numWordsPerPlayer}
                                    allowRandom={!game.$isTutorial}
                                    defaultValues={defaultValues}
                                />
                            </Grid>
                        )
                    }
                    {allMyWordsEntered && myWordCards.length > 0 && (
                        <Grid item xs={12} component={Typography} variant="subtitle1">
                            <Trans i18nKey="GAME.PREP.MY_WORDS" count={myWords.length}>Meine Begriffe</Trans>
                            {!game.$isTutorial && (<IconButton onClick={this.resetWords} component={Box} ml={1}>
                                <EditIcon fontSize="small" />
                            </IconButton>)}
                        </Grid>
                    )}
                    {allMyWordsEntered && myWordCards}
                    {isHost && !game.$isTutorial && (
                        <Button variant="outlined"
                                startIcon={<ArrowBackIcon />}
                                onClick={this.backToLobby}>
                            <Trans i18nKey="COMMON.BACK">Back</Trans>
                        </Button>
                    )}
                </Grid>
                <Grid item xs={12} sm={6} container spacing={2} alignItems="center" className="Player-list">
                    <Grid item xs={12} component={Typography} variant="h5">
                        <Trans i18nKey="COMMON.TEAMMATES">Mitspieler</Trans>
                    </Grid>
                    {listOfPlayers}
                </Grid>
                <TutorialOverlay game={game} />
            </Grid>
        );
    }

}
