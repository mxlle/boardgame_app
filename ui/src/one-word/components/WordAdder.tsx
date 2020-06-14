import React from 'react';
import { Trans } from 'react-i18next';
import {Button, IconButton, InputAdornment, Typography} from '@material-ui/core';
import CasinoIcon from '@material-ui/icons/Casino';
import TextField from '@material-ui/core/TextField';
import i18n, {getCurrentLanguage} from '../../i18n';
import {WordEvent} from "../../types";
import socket from "../../shared/socket";
import ActionButton from "../../common/ActionButton";

type WordAdderProps = {
    add: (words: string[])=>void,
    numOfWords: number,
    allowRandom?: boolean,
    defaultValues?: string[]
}

type WordAdderState = {
    words: string[],
    randomLoading: boolean[]
}

export class WordAdder extends React.Component<WordAdderProps, WordAdderState> {

    constructor(props: WordAdderProps) {
        super(props);

        const words: string[] = props.defaultValues || [];
        this.state = {words, randomLoading: []};

        this.handleChange = this.handleChange.bind(this);
        this.keyPressed = this.keyPressed.bind(this);
    }

    handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const index = parseInt(event.target.name.substr(4));
        const word = event.target.value;
        this.setState((state, props) => {
            const newWords = state.words;
            newWords[index] = word;
            return {
                words: newWords
            };
        });
    }

    keyPressed(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === "Enter") {
            const words = this.state.words;
            const enterDisabled = words.length < this.props.numOfWords || words.some(word => !word || word.length === 0);
            if (!enterDisabled) this.props.add(words);
        }
    }

    render() {
        const { add, numOfWords, allowRandom } = this.props;
        const { words, randomLoading } = this.state;

        const getRandomWord = (index: number) => {
            this.setState((prevState) => {
                prevState.randomLoading[index] = true;
                return { randomLoading: prevState.randomLoading };
            });
            socket.emit(WordEvent.GetRandom, getCurrentLanguage(), (word: string) => {
                this.setState((prevState) => {
                    prevState.words[index] = word;
                    for (let i = 0; i < prevState.words.length; i++) prevState.words[i] = prevState.words[i] || ''; // to have no empty values
                    prevState.randomLoading[index] = false;
                    return {
                        words: prevState.words,
                        randomLoading: prevState.randomLoading
                    }
                });
            });
        };

        const wordFields = [];
        for (let i=0; i<numOfWords; i++) {
            const label = i18n.t("GAME.PREP.WORD_ADDER.LABEL", "Wort "+(i+1), {count: numOfWords, index: i+1});
            wordFields.push(
                <TextField required label={label}
                    variant="filled"
                    placeholder={i18n.t("GAME.PREP.WORD_ADDER.PLACEHOLDER", "Ratebegriff eingeben")}
                    name={`word${i}`}
                    key={`word${i}`}
                    value={words[i]||''}
                    onChange={this.handleChange} 
                    onKeyPress={this.keyPressed}
                    InputProps={allowRandom ? {
                         endAdornment: (
                             <InputAdornment position="end">
                                 <ActionButton loading={randomLoading[i] || false}>
                                     <IconButton onClick={() => getRandomWord(i)}>
                                         <CasinoIcon/>
                                     </IconButton>
                                 </ActionButton>
                             </InputAdornment>
                         )
                   } : undefined}
                />
            );
        }
        
        const enterDisabled = words.length < numOfWords || words.some(word => !word || word.length === 0);

        return (
            <div className="Word-adder">
                <Typography variant="subtitle1">
                    <Trans i18nKey="GAME.PREP.WORD_ADDER.HEADING" count={numOfWords}>Gib Begriffe für das Spiel ein</Trans>
                </Typography>
                {wordFields}
                <Button variant="contained" color="primary" className="submitBtn"
                    disabled={enterDisabled}
                    onClick={() => add(words)}>
                    <Trans i18nKey="GAME.PREP.WORD_ADDER.BUTTON" count={numOfWords}>Jetzt abschicken</Trans>
                </Button>
            </div>
        );
    }

}