import React from 'react';
import { Link } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { AppBar, Toolbar, IconButton, Typography, Button, Menu, MenuItem, ListItemIcon } from '@material-ui/core';
import { 
    Home as HomeIcon, 
    AccountCircle as AccountCircleIcon, 
    Translate as TranslateIcon, 
    BrightnessMedium as BrightnessMediumIcon 
} from '@material-ui/icons';
import { createStyles, withStyles, WithStyles, Theme } from '@material-ui/core/styles';

import { SETTING_NAME, ThemeMode } from '../shared/constants';

import { UserConfig } from './UserConfig';

const styles = (theme: Theme) => createStyles({
    root: {
        marginBottom: theme.spacing(4),
        padding: theme.spacing(1)
    }, 
    title: {
        flex: '1 1 auto',
        letterSpacing: 4,
        fontSize: '4vw', // relative to width
        [theme.breakpoints.up('lg')]: {
            fontSize: 40,
        },
    },
    linkBtn: {
        color: 'inherit'
    }
});

type HeaderBarProps = {
    userTheme: string,
    applyUserTheme: (color: string)=>void
}&WithStyles<typeof styles>;

const HeaderBar = (props: HeaderBarProps) => {
    const { i18n } = useTranslation();
    const { userTheme, applyUserTheme, classes } = props;
    const [themeConfigOpen, setThemeConfigOpen] = React.useState(false);
    const [languageConfigOpen, setLanguageConfigOpen] = React.useState(false);
    const [language, setLanguage] = React.useState(i18n.language);
    const [anchorEl, setAnchorEl] = React.useState(null);

    const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        const target: any = event.currentTarget; // TODO 
        setAnchorEl(target);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const changeLanguage = (lng: string) => {
        setLanguage(lng);
        i18n.changeLanguage(lng);
    };

    const currentUserName: string|null = localStorage.getItem(SETTING_NAME);

    const availableThemes = [
        { val: ThemeMode.AUTO, tKey: 'THEMEPICK.AUTO' },
        { val: ThemeMode.BRIGHT, tKey: 'THEMEPICK.BRIGHT' },
        { val: ThemeMode.DARK, tKey: 'THEMEPICK.DARK' }
    ];

    const availableLanguages = [
        { val: 'de', tKey: 'LANGPICK.DE' },
        { val: 'en', tKey: 'LANGPICK.EN' }
    ];

    return (
        <AppBar position="sticky" className={classes.root}>
            <Toolbar>
                <Link to="/" className={classes.linkBtn}>
                    <IconButton edge="start" color="inherit" aria-label="home">
                        <HomeIcon />
                    </IconButton>
                </Link>
                <Typography variant="h2" className={classes.title}>
                    <Trans i18nKey="APP_TITLE">Nur ein Wort!</Trans>
                </Typography>
                { 
                    currentUserName ? 
                    <Button onClick={openMenu} color="inherit" startIcon={<AccountCircleIcon />}>
                        {currentUserName}
                    </Button> : 
                    <IconButton onClick={openMenu} edge="end" color="inherit">
                        <AccountCircleIcon />
                    </IconButton>
                }
                <Menu
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={()=>{setThemeConfigOpen(true);handleMenuClose();}}>
                        <ListItemIcon><BrightnessMediumIcon/></ListItemIcon>
                        <Trans i18nKey="THEMEPICK.HEADING">Nachtmodus</Trans>
                    </MenuItem>
                    <MenuItem onClick={()=>{setLanguageConfigOpen(true);handleMenuClose();}}>
                        <ListItemIcon><TranslateIcon/></ListItemIcon>
                        <Trans i18nKey="LANGPICK.HEADING">Sprache</Trans>
                    </MenuItem>
                </Menu>
                <UserConfig 
                    tKey="THEMEPICK.HEADING"
                    open={themeConfigOpen} 
                    onClose={(theme: string) => { applyUserTheme(theme); setThemeConfigOpen(false); }}
                    selectedValue={userTheme} 
                    possibleValues={availableThemes}
                />
                <UserConfig 
                    tKey="LANGPICK.HEADING"
                    open={languageConfigOpen} 
                    onClose={(lng: string) => { changeLanguage(lng); setLanguageConfigOpen(false); }}
                    selectedValue={language} 
                    possibleValues={availableLanguages}
                />
            </Toolbar>
        </AppBar>
    );    
}

export default withStyles(styles)(HeaderBar);

