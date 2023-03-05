import React from 'react';
import {RouteComponentProps, withRouter} from 'react-router-dom'
import {Box, Button, Container} from '@material-ui/core';
import {createStyles, Theme, WithStyles, withStyles} from '@material-ui/core/styles';
import {Trans, WithTranslation, withTranslation} from 'react-i18next';
import {withSnackbar, WithSnackbarProps} from 'notistack';

import {SETTING_ID, SETTING_NAME} from '../shared/constants';
import api from '../shared/apiFunctions';
import {STYLES} from '../theme';
import {getOpenAiKey, setOpenAiKey} from "../shared/functions";
import {getCurrentLanguage} from "../i18n";

const styles = (_theme: Theme) => createStyles({
    root: {
        ...STYLES.flexCenter,
        flexDirection: 'column',
    },
});

type ChatGptPlaygroundProps = {}&WithTranslation&WithSnackbarProps&RouteComponentProps&WithStyles<typeof styles>;
type ChatGptPlaygroundState = {
    lastWord: string,
    hints: string[],
    isAiAvailable: boolean,
};

class ChatGptPlayground extends React.Component<ChatGptPlaygroundProps,ChatGptPlaygroundState> {
    public currentUserId: string = localStorage.getItem(SETTING_ID) || '';
    public currentUserName: string = localStorage.getItem(SETTING_NAME) || '';

    private _isMounted: boolean = false;

    constructor(props: ChatGptPlaygroundProps) {
        super(props);

        this.generateWord = this.generateWord.bind(this);
        this.generateHintForWord = this.generateHintForWord.bind(this);
        this.generateGuessForHints = this.generateGuessForHints.bind(this);
        this.activateAi = this.activateAi.bind(this);

        this.state = {  lastWord: '', hints: [], isAiAvailable: !!getOpenAiKey() };
    }

    componentDidMount() {
        this._isMounted = true;

        document.title = this.props.i18n.t('APP_TITLE', 'Just one word!');
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    async generateWord() {
        const word = await api.generateWordToGuess(getOpenAiKey(), getCurrentLanguage());
        console.log(word);
        this.setState({lastWord: word, hints: []});
        this.props.enqueueSnackbar(word, { variant: this.responseIsError(word) ? 'error' : 'info' });
    }

    async generateHintForWord() {
        let {lastWord, hints} = this.state;
        if (!lastWord) {
            return;
        }

        const newHints = await api.generateHintsForWord(getOpenAiKey(), lastWord, getCurrentLanguage());
        console.log(newHints);
        if (newHints) {
            this.setState({hints: [...hints, ...newHints]});
        }
        this.props.enqueueSnackbar(newHints.join(', '), { variant: this.responseIsError(newHints[0]) ? 'error' : 'info' });
    }

    async generateGuessForHints() {
        let {hints} = this.state;
        if (!hints || hints.length === 0) {
            return;
        }

        const guess = await api.generateGuessForHints(getOpenAiKey(), hints, getCurrentLanguage());
        console.log(guess);
        this.props.enqueueSnackbar(guess, { variant: this.responseIsError(guess) ? 'error' : 'info' });
    }

    private responseIsError(response: string) {
        return response.startsWith('Error:');
    }

    activateAi() {
        const key = window.prompt(this.props.i18n.t('AI.ACTIVATION.PROMPT', 'Please enter your OpenAI API key or the secret password'), getOpenAiKey() ?? '');
        if (key !== null) {
            setOpenAiKey(key);
            this.setState({isAiAvailable: !!getOpenAiKey()});
        }
    }

    render() {
        let { classes } = this.props;
        let { lastWord, hints, isAiAvailable} = this.state;
        const hintText = hints.map((hint) => `"${hint}"`).join(', ');

        return (
            isAiAvailable ?
                <Container maxWidth="sm" className={classes.root}>
                    <Box mb={2}>
                        <Button variant="contained" onClick={this.generateWord}>
                            <Trans i18nKey="AI.PLAYGROUND.GENERATE_WORD">Generate word</Trans>
                        </Button>
                    </Box>
                    <Box mb={2}>
                        <Button variant="contained" disabled={!lastWord} onClick={this.generateHintForWord}>
                            <Trans i18nKey="AI.PLAYGROUND.GENERATE_HINTS" tOptions={{word: lastWord}}>Generate hint for "{lastWord}"</Trans>
                        </Button>
                    </Box>
                    <Box mb={2}>
                        <Button variant="contained" disabled={!hints.length} onClick={this.generateGuessForHints}>
                            <Trans i18nKey="AI.PLAYGROUND.GENERATE_GUESS" tOptions={{hints: hintText}}>Generate guess for "{hintText}"</Trans>
                        </Button>
                    </Box>
                    <Box mb={2}>
                        <Button variant="contained" onClick={this.activateAi}><Trans i18nKey="AI.ACTIVATION.RESET_BUTTON">Set new OpenAI API key</Trans></Button>
                    </Box>
                </Container>
                : <Container maxWidth="sm" className={classes.root}><Button variant="contained" onClick={this.activateAi}><Trans i18nKey="AI.ACTIVATION.BUTTON">Activate AI</Trans></Button> </Container>
        );
    }
}

export default withTranslation()(withRouter(withSnackbar(withStyles(styles)(ChatGptPlayground))));
