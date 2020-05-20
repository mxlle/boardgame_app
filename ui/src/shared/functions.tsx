import { APP_TITLE } from './constants';
import { IGame, IUser } from '../custom.d';

export function getCurrentUserInGame(game: IGame, currentUserId: string): IUser|undefined {
    return game.players.find((player: IUser) => player.id === currentUserId);
}

export function setDocumentTitle(gameName?: string) {
    if (gameName) {
        document.title = `${APP_TITLE} - ${gameName}`;
    } else {
        document.title = APP_TITLE;
    }
}