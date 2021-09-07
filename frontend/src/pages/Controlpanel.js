import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AppBar, createTheme, CssBaseline, IconButton, ThemeProvider, Toolbar, Typography, useMediaQuery } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ServerCard from './../components/ServerCard';

import Brightness2Icon from '@material-ui/icons/Brightness2';
import Brightness5Icon from '@material-ui/icons/Brightness5';

const useStyles = makeStyles((theme) => ({
    root: {

    },
    media: {
        height: 100,
        width: '33%',
        marginLeft: '33%'
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    }
}));

/**
 * End game is to implement websocket interface and therefore update data in real time
 * @param {*} param0 
 * @returns 
 */
export default function Controlpanel({ match }) {
    const [userInfo, setUserInfo] = useState({});
    const [prefDarkMode, setPrefDarkMode] = useState(useMediaQuery('(prefers-color-scheme: dark)'));
    console.log(match)

    const theme = createTheme({
        palette: {
            type: prefDarkMode ? 'dark' : 'light',
            primary: {
                main: '#F0A500',
            },
            secondary: {
                main: '#CF7500',
            },
        }
    })

    useEffect(() => {
        axios.post('http://localhost:8080/verify', {
            token: match.params.token,
        })
            .then(function (response) {
                console.log(response);
                setUserInfo(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const classes = useStyles();
    console.log(userInfo);
    const cards = [];
    if (userInfo && Object.keys(userInfo).length > 0) {
        userInfo.guilds.forEach((el, index) => {
            cards.push(<ServerCard details={el} token={match.params.token} key={index} />)
        })
    }
    return (
        <div className="App">
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" className={classes.title}>
                            Nya~bot
                        </Typography>
                        <IconButton aria-label="Toggle theme" onClick={() => { setPrefDarkMode(!prefDarkMode) }}>
                            {prefDarkMode === false ? <Brightness2Icon /> : <Brightness5Icon />}
                        </IconButton>
                    </Toolbar>
                </AppBar>
                {cards}
            </ThemeProvider>
        </div>
    );
}