import { APP_TITLE } from './constants';

export function setDocumentTitle(gameName?: string) {
    if (gameName) {
        document.title = `${APP_TITLE} - ${gameName}`;
    } else {
        document.title = APP_TITLE;
    }
}