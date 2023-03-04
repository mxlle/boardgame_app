import React from 'react';
import {RouteComponentProps, withRouter} from 'react-router-dom'
import {Box, Button, Container} from '@material-ui/core';
import {createStyles, Theme, WithStyles, withStyles} from '@material-ui/core/styles';
import {WithTranslation, withTranslation} from 'react-i18next';
import {withSnackbar, WithSnackbarProps} from 'notistack';

import {SETTING_ID, SETTING_NAME} from '../shared/constants';
import api from '../shared/apiFunctions';
import {STYLES} from '../theme';
import {TUTORIAL_ID} from "./tutorial";

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

        this.state = {  lastWord: '', hints: [] };
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
        this.props.enqueueSnackbar(word, { variant: 'info' });
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
        this.props.enqueueSnackbar(hint, { variant: 'info' });
    }

    async generateGuessForHints() {
        let {hints} = this.state;
        if (!hints || hints.length === 0) {
            return;
        }

        const guess = await api.generateGuessForHints(hints);
        console.log(guess);
        this.props.enqueueSnackbar(guess, { variant: 'info' });
    }

    startTutorial() {
        this.props.history.push('/' + TUTORIAL_ID);
    }

    render() {
        let { classes } = this.props;
        let { lastWord, hints} = this.state;

        return (
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
            </Container>
        );
    }
}

export default withTranslation()(withRouter(withSnackbar(withStyles(styles)(ChatGptPlayground))));
