import React from 'react';
import { Trans } from 'react-i18next';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import {WordCard} from './components/WordCard';
import { IGame } from '../custom.d';
import { checkPrevResult } from '../shared/functions';

type GameEndViewProps = {
    game: IGame
}&WithSnackbarProps;

type HintWritingViewState = {
    shownPrevResult: boolean
};

class GameEndView extends React.Component<GameEndViewProps> {
    public state: HintWritingViewState = { shownPrevResult: false };
    private _isMounted: boolean = false;

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
        this.props.closeSnackbar();
    }

    render() {
        const game: IGame = this.props.game;
        const { shownPrevResult } = this.state;
        const correctWords = game.correctWords.map(wordResult => {
            return <WordCard key={wordResult.word} word={wordResult.word} guess={wordResult.guess} guessedRight={true}/>
        });
        const wrongWords = game.wrongWords.map(wordResult => {
            return <WordCard key={wordResult.word} word={wordResult.word} guess={wordResult.guess} guessedRight={false}/>
        });

        if (!shownPrevResult) {
            checkPrevResult(game, this.props.enqueueSnackbar, ()=>{ 
                if(this._isMounted) this.setState({shownPrevResult: true}); 
            });
        }

        return (
            <div className="Game-end-view">
                <div className="Correct-words">
                    <h2><Trans i18nKey="GAME.END.RIGHT" count={game.correctWords.length}>Richtig</Trans></h2>
                    {correctWords}
                </div>
                <div className="Wrong-words">
                    <h2><Trans i18nKey="GAME.END.WRONG" count={game.wrongWords.length}>Falsch</Trans></h2>
                    {wrongWords}
                </div>
            </div>
        );
    }
}

export default withSnackbar(GameEndView);
