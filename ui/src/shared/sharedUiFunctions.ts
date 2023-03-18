import api from "./apiFunctions";
import {getCurrentUserId, sleep} from "./functions";
import {SETTING_COLOR, SETTING_NAME} from "./constants";
import {getRandomColor} from "./color-util";
import {IGame} from "../types";

export async function createAiGame(gameId: string) {
    await api.addPlayer(gameId, {
        id: getCurrentUserId(),
        name: localStorage.getItem(SETTING_NAME) || 'You',
        color: getRandomColor(localStorage.getItem(SETTING_COLOR))
    })
    await api.addAiPlayer(gameId);
    await api.addAiPlayer(gameId);
    await api.addAiPlayer(gameId);
}

export async function triggerAiConfetti(game: IGame, triggerConfetti: (colors: string[]) => void) {
    const aiColors = game.players.filter(p => p.isAi).map(p => p.color);

    for (let color of aiColors) {
        if (!color) {
            continue;
        }

        const timeout = Math.random() * 3000;
        await sleep(timeout);
        triggerConfetti([color]);
    }
}
