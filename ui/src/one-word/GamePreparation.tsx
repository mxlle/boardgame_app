import React from 'react';
import { Trans } from 'react-i18next';
import { IGame, IUser, DEFAULT_NUM_WORDS } from '../types';
import { Grid, Paper, Typography } from '@material-ui/core';
import WordHint from './components/WordHint';
import WordCard from './components/WordCard';
import { WordAdder } from './components/WordAdder';
import { getRandomColor } from '../common/ColorPicker';

import { SETTING_ID, SETTING_NAME, SETTING_COLOR } from '../shared/constants';
import api from '../shared/apiFunctions';
import {nextTutorialStep, TUTORIAL_WORDS} from "./tutorial";
import TutorialOverlay from "../common/TutorialOverlay";
import {OneWordGameChildProps} from "./OneWordGame";

type GamePreparationProps = {
    game: IGame
}&OneWordGameChildProps;

type GamePreparationState = {}

export class GamePreparation extends React.Component<GamePreparationProps,GamePreparationState> {
    // TODO central place for player
    public currentPlayer: IUser =  {
        id: localStorage.getItem(SETTING_ID) || '',
        name: localStorage.getItem(SETTING_NAME) || '',
        color: getRandomColor(localStorage.getItem(SETTING_COLOR))
    };

    constructor(props: GamePreparationProps) {
        super(props);

        this.addWords = this.addWords.bind(this);
    }

    async addWords(words: string[]) {
        if (this.props.game.$isTutorial) { nextTutorialStep(); return; }

        let player: IUser = this.currentPlayer;
        player.enteredWords = words;

        await api.updatePlayer(this.props.game.id, player);
    }

    render() {
        const { game } = this.props;
        const numWordsPerPlayer = game.wordsPerPlayer || DEFAULT_NUM_WORDS;
        const currentUserId: string = localStorage.getItem(SETTING_ID) || '';
        let isInGame: boolean = false;
        let myWords: string[] = [];
        let allMyWordsEntered: boolean = false;
        const listOfPlayers = game.players.map(player => {
            const wordsEntered: boolean = !!player.enteredWords && player.enteredWords.length === numWordsPerPlayer;
            if (player.id === currentUserId) {
                isInGame = true;
                myWords = player.enteredWords || [];
                allMyWordsEntered = wordsEntered;
            } 
            return (
                <WordHint key={player.id} hint={player.name} color={player.color} showPencil={!wordsEntered} />
            )
        });

        const defaultValue: string|undefined = game.$isTutorial ? TUTORIAL_WORDS[0] : undefined;
        const myWordCards = myWords.map(word => <WordCard key={word} small word={word} />)

        // TODO not in game users
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
                                <WordAdder add={this.addWords} numOfWords={numWordsPerPlayer} defaultValue={defaultValue}/>
                            </Grid>
                        )
                    }
                    {myWordCards.length > 0 && (
                        <Grid item xs={12} component={Typography} variant="subtitle1">
                            <Trans i18nKey="GAME.PREP.MY_WORDS" count={myWords.length}>Meine Begriffe</Trans>
                        </Grid>
                    )}
                    {myWordCards}
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