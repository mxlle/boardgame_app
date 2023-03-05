import React from 'react';
import {withTranslation, WithTranslation} from "react-i18next";
import {GamePhase, IGame, IHint} from '../../types';
import WordHint from '../components/WordHint';

import {getPlayerInGame} from "../gameFunctions";
import {extractGameData} from "../../shared/functions";
import {TUTORIAL_HINTS} from "../tutorial";
import {OneWordGameChildProps} from "../OneWordGame";
import {Checkbox, IconButton} from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';
import {Mood as MoodIcon, MoodBad as MoodBadIcon} from "@material-ui/icons";

type WordHintListProps = {
    game: IGame,
    submittedHints?: {[key: string]: { hint: string, reset?: boolean }},
    submitHint?: (id: string, hint: string) => void,
    resetHint?: (id: string, hint: string) => void,
    toggleDuplicate?: (hintId: string) => void

}&WithTranslation&OneWordGameChildProps;

class WordHintList extends React.Component<WordHintListProps> {
    render() {
        const {game, submittedHints, resetHint, submitHint, toggleDuplicate, i18n} = this.props;
        const { currentRound, currentUser, isGuesser, isRoundHost, isGameHost} = extractGameData(game);

        const currentHints = currentRound.hints.map((hintObj: IHint) => {
            let hint: string = hintObj.hint;
            let defaultValue = '';

            const hintIsMine = currentUser && currentUser.id === hintObj.authorId;
            const author = getPlayerInGame(game, hintObj.authorId) || { name: '?', id: '?' };
            const authorName = hintIsMine ? i18n.t('COMMON.ME', 'Me') : author.name;

            if (submittedHints && hintIsMine && submittedHints[hintObj.id]) {
                if (submittedHints[hintObj.id].reset) {
                    defaultValue = submittedHints[hintObj.id].hint;
                } else if (!hint) {
                    hint = submittedHints[hintObj.id].hint;
                }
            }

            const showHint = !hint || hintIsMine;
            const showInput = GamePhase.HintWriting === game.phase && !hint && hintIsMine;
            const showResetButton = GamePhase.HintWriting === game.phase && hintIsMine && !showInput && !game.$isTutorial;
            const showToggleButton = GamePhase.HintComparing === game.phase && (isRoundHost || isGameHost);

            const showCheck = (GamePhase.HintWriting === game.phase && !showHint) || (GamePhase.HintComparing === game.phase && (isGuesser || !currentUser));
            const showCross = [GamePhase.HintComparing, GamePhase.Guessing].includes(game.phase) && (isGuesser || !currentUser) && hintObj.isDuplicate;

            if (game.$isTutorial && hintIsMine) defaultValue = TUTORIAL_HINTS[currentRound.word][0];

            return (
                <WordHint
                    // general properties
                    key={hintObj.id}
                    hint={hint}
                    author={authorName}
                    color={author.color}

                    // properties for none writing phase
                    duplicate={hintObj.isDuplicate}
                    showCross={showCross}

                    // properties for writing phase
                    showPencil={!showInput && !hint}
                    showCheck={showCheck}
                    submitHint={showInput && submitHint ? (h) => submitHint(hintObj.id, h) : undefined}
                    defaultValue={defaultValue}
                >
                    {showResetButton && resetHint && (
                        <IconButton color="primary" onClick={() => resetHint(hintObj.id, hint)}>
                            <EditIcon />
                        </IconButton>
                    )}
                    {showToggleButton && toggleDuplicate && (
                        <Checkbox
                            icon={<MoodIcon />} checkedIcon={<MoodBadIcon />}
                            checked={hintObj.isDuplicate || false}
                            onChange={ ()=>toggleDuplicate(hintObj.id) }/>
                    )}
                </WordHint>
            );
        });

        return <React.Fragment>{currentHints}</React.Fragment>;
    }
}

export default withTranslation()(WordHintList);
