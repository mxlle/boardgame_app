import { ThemeOptions } from '@material-ui/core/styles';
import { CSSProperties } from '@material-ui/core/styles/withStyles';

const DEFAULT_PRIMARY_COLOR = '#43a047';
const DEFAULT_SECONDARY_COLOR = '#d32f2f'; // also error dark

export function getTheme(primaryColor: string|null, prefersDarkMode: boolean): ThemeOptions {
    return {
        palette: {
            primary: {
                main: primaryColor || DEFAULT_PRIMARY_COLOR
            },
            secondary: {
                main: DEFAULT_SECONDARY_COLOR,
            }, 
            type: prefersDarkMode ? 'dark' : 'light',
        },
        breakpoints: {
            values: {
                xs: 0,
                sm: 600,
                md: 720,
                lg: 960,
                xl: 1280,
            },
        },
        typography: {
            h2: {
                ...STYLES.handwriting
            },
            h5: {
                ...STYLES.handwriting,
                paddingTop: 8,
                textTransform: 'capitalize',
            },
            caption: {
                ...STYLES.handwriting,
                fontSize: '1.2rem',
                lineHeight: 1,
            },
        },
    };
}

export const STYLES: { [key:string]: CSSProperties; } = {
    'flexCenter': {
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'center',
    },
    'handwriting': {
        fontFamily: ['Gloria Hallelujah', 'cursive'].join(','),
    }
};