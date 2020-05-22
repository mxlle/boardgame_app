import React from 'react';
import { Trans } from 'react-i18next';
import { IGame, GamePhase } from '../../custom.d';
import { getUserInGame } from '../../shared/functions';

type GameStatsProps = {
    game: IGame
};

export class GameStats extends React.Component<GameStatsProps> {
    render() {
        const game: IGame = this.props.game;
        const roundHost = getUserInGame(game, game.roundHost) || { name: '?' };
        const roundHostName = roundHost.name;
        const guesser = getUserInGame(game, game.currentGuesser) || { name: '?' };
        const guesserName = guesser.name;

        let gamePhase;
        switch(game.phase) {
            case GamePhase.HintWriting: 
                const players = game.players.filter(p => game.currentGuesser && p.id !== game.currentGuesser).map(p => p.name);
                const playersString = players.slice(0, players.length-1).join(', ') + ' und ' + players[players.length-1];
                gamePhase = <Trans i18nKey="GAME.STATS.PHASE_WRITING">{{playersString}} schreiben Hinweise auf...</Trans>;
                break;
            case GamePhase.HintComparing: 
                gamePhase = <Trans i18nKey="GAME.STATS.PHASE_COMPARING">{{roundHostName}} überprüft die Hinweise ...</Trans>;
                break;
            case GamePhase.Guessing: 
                gamePhase = <Trans i18nKey="GAME.STATS.PHASE_GUESSING">{{guesserName}} versucht den Begriff zu erraten...</Trans>;
                break;
            case GamePhase.Solution: 
                if (game.guessedRight) {
                    gamePhase = <Trans i18nKey="GAME.STATS.PHASE_SOLUTION">{{guesserName}} lag genau richtig!</Trans>;
                } else {
                    gamePhase = <Trans i18nKey="GAME.STATS.PHASE_SOLUTION_WRONG">{{roundHostName}} lag daneben! {{guesserName}} entscheidet ob es trotzdem zählt...</Trans>;
                }
                break;
        }

        const round = game.round+1;
        const roundCount = game.words.length;
        const rightCount = game.correctWords.length;
        const wrongCount = game.wrongWords.length;

        return (
            <div className="Game-progress">
                <div>
                    <Trans i18nKey="GAME.STATS.ROUND">
                        Runde {{round}}/{{roundCount}}
                    </Trans>, <Trans i18nKey="GAME.STATS.RIGHT">
                        Richtige: {{rightCount}}
                    </Trans>, <Trans i18nKey="GAME.STATS.WRONG">
                        Falsche: {{wrongCount}}
                    </Trans>
                </div>
                <div><Trans i18nKey="GAME.STATS.PHASE">Phase</Trans>: {gamePhase}</div>
            </div>
        );
    }
}
