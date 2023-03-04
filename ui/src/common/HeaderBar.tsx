import React from 'react';
import {Link} from 'react-router-dom';
import {Trans, useTranslation} from 'react-i18next';
import {AppBar, Button, IconButton, ListItemIcon, Menu, MenuItem, Toolbar, Typography} from '@material-ui/core';
import {
    AccountCircle as AccountCircleIcon,
    BrightnessMedium as BrightnessMediumIcon,
    Home as HomeIcon,
    StarRounded as StarIcon,
    Translate as TranslateIcon
} from '@material-ui/icons';
import {createStyles, Theme, WithStyles, withStyles} from '@material-ui/core/styles';

import {SETTING_NAME, ThemeMode} from '../shared/constants';

import {SelectionDialog} from './SelectionDialog';

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
        color: 'inherit',
        marginRight: theme.spacing(2),
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
    const [anchorEl, setAnchorEl]: [HTMLButtonElement|undefined, (e: HTMLButtonElement|undefined)=>void] = React.useState();

    const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        const target = event.currentTarget;
        setAnchorEl(target);
    };

    const handleMenuClose = () => {
        setAnchorEl(undefined);
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
                <Link to="/chat-gpt-playground" className={classes.linkBtn}>
                    <IconButton edge="start" color="inherit" aria-label="home">
                        <StarIcon />
                    </IconButton>
                </Link>
                <Typography variant="h2" className={classes.title}>
                    <Trans i18nKey="APP_TITLE">Just one word!</Trans>
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
                    anchorEl={anchorEl as HTMLButtonElement}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={()=>{setThemeConfigOpen(true);handleMenuClose();}}>
                        <ListItemIcon><BrightnessMediumIcon/></ListItemIcon>
                        <Trans i18nKey="THEMEPICK.HEADING">Dark theme</Trans>
                    </MenuItem>
                    <MenuItem onClick={()=>{setLanguageConfigOpen(true);handleMenuClose();}}>
                        <ListItemIcon><TranslateIcon/></ListItemIcon>
                        <Trans i18nKey="LANGPICK.HEADING">Language</Trans>
                    </MenuItem>
                </Menu>
                <SelectionDialog
                    tKey="THEMEPICK.HEADING"
                    open={themeConfigOpen} 
                    onClose={(theme: string) => { applyUserTheme(theme); setThemeConfigOpen(false); }}
                    selectedValue={userTheme} 
                    possibleValues={availableThemes}
                />
                <SelectionDialog
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

