// api url
const isProd = window.location.hostname === 'justone.okj.name';
const apiPort = isProd ? '' : ':9000';
export const API_URL = window.location.protocol + '//' + window.location.hostname + apiPort + '/api';
export const GAME_URL = API_URL + '/games';

// localStorage keys
export const SETTING_ID = 'playerId';
export const SETTING_NAME = 'playerName';
export const SETTING_COLOR = 'playerColor';
export const SETTING_THEME = 'darkTheme';

// app content and theming
export const APP_TITLE = 'Nur ein Wort!';
export const DEFAULT_NUM_WORDS: number = 2; // Two words per player
export const DEFAULT_PRIMARY_COLOR = '#43a047';
export const DEFAULT_SECONDARY_COLOR = '#d32f2f'; // also error dark
export enum ThemeMode {
  AUTO = 'automatisch',
  BRIGHT = 'hell',
  DARK = 'dunkel'
}