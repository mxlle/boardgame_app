import React from 'react';
import {RouteComponentProps, withRouter} from 'react-router-dom'
import {Box, Button, Container} from '@material-ui/core';
import {createStyles, Theme, WithStyles, withStyles} from '@material-ui/core/styles';
import {Trans, WithTranslation, withTranslation} from 'react-i18next';
import {withSnackbar, WithSnackbarProps} from 'notistack';

import {SETTING_ID, SETTING_NAME} from '../shared/constants';
import api from '../shared/apiFunctions';
import {STYLES} from '../theme';
import {TUTORIAL_ID} from "./tutorial";
import {getOpenAiKey, setOpenAiKey} from "../shared/functions";

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
        const word = await api.generateWordToGuess();
        console.log(word);
        this.setState({lastWord: word, hints: []});
        this.props.enqueueSnackbar(word, { variant: this.responseIsError(word) ? 'error' : 'info' });
    }

    async generateHintForWord() {
        let {lastWord, hints} = this.state;
        if (!lastWord) {
            return;
        }

        const hint = await api.generateHintForWord(lastWord);
        console.log(hint);
        if (hint && !hints.includes(hint)) {
            this.setState({hints: [...hints, hint]});
        }
        this.props.enqueueSnackbar(hint, { variant: this.responseIsError(hint) ? 'error' : 'info' });
    }

    async generateGuessForHints() {
        let {hints} = this.state;
        if (!hints || hints.length === 0) {
            return;
        }

        const guess = await api.generateGuessForHints(hints);
        console.log(guess);
        this.props.enqueueSnackbar(guess, { variant: this.responseIsError(guess) ? 'error' : 'info' });
    }

    private responseIsError(response: string) {
        return response.startsWith('Error:');
    }

    startTutorial() {
        this.props.history.push('/' + TUTORIAL_ID);
    }

    activateAi() {
        setOpenAiKey(window.prompt('Please enter your OpenAI API key or the secret password') ?? '');
        this.setState({isAiAvailable: !!getOpenAiKey()});
    }

    render() {
        let { classes } = this.props;
        let { lastWord, hints} = this.state;
        const isAiAvailable = !!getOpenAiKey();

        return (
            isAiAvailable ?
                <Container maxWidth="sm" className={classes.root}>
                    <Box mb={2}>
                        <Button variant="contained" onClick={this.generateWord}>
                            Generate word
                        </Button>
                    </Box>
                    <Box mb={2}>
                        <Button variant="contained" disabled={!lastWord} onClick={this.generateHintForWord}>
                            Generate hint for "{lastWord}"
                        </Button>
                    </Box>
                    <Box mb={2}>
                        <Button variant="contained" disabled={!hints.length} onClick={this.generateGuessForHints}>
                            Generate guess for "{hints.join(', ')}"
                        </Button>
                    </Box>
                    <Box mb={2}>
                        <Button variant="contained" onClick={this.activateAi}><Trans i18nKey="COMMON.RESET_AI_KEY">Set new OpenAI API key</Trans></Button>
                    </Box>
                </Container>
                : <Container maxWidth="sm" className={classes.root}><Button variant="contained" onClick={this.activateAi}><Trans i18nKey="COMMON.ACTIVATE_AI">Activate AI</Trans></Button> </Container>
        );
    }
}

export default withTranslation()(withRouter(withSnackbar(withStyles(styles)(ChatGptPlayground))));
