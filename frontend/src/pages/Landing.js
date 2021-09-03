import React, { useState } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { AppBar, Button, IconButton, Toolbar, Typography, CardMedia } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

import Brightness2Icon from '@material-ui/icons/Brightness2';
import Brightness5Icon from '@material-ui/icons/Brightness5';

async function apiCall(token) {
    return new Promise(resolve => {
        axios.post('http://localhost:8080/verify', {
            token: token,
        })
            .then(function (response) {
                console.log(response);
                resolve(response.body);
            })
            .catch(function (error) {
                console.log(error);
            });
    })
}

// discord://discordapp.com/channels/@me
export default function Landing() {
    const [prefDarkMode, setPrefDarkMode] = useState(useMediaQuery('(prefers-color-scheme: dark)'));
    const [serverDetails, setServerDetails] = useState({ icon: __dirname + '/../../public/altimage.jpg' });

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

    apiCall()
        .then(data => {
            setServerDetails(data);
        });

    const useStyles = makeStyles((theme) => ({
        root: {
            flexGrow: 1,
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        title: {
            flexGrow: 1,
        },
    }));

    const classes = useStyles()

    return (
        <div className={classes.root}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" className={classes.title}>
                            Nya~bot
                        </Typography>
                        <Button color="inherit">Invite</Button>
                        <Button color="inherit">Commands</Button>
                        <Button color="inherit">Security</Button>
                        <Button color="inherit">Control Panel</Button>
                        <IconButton aria-label="Toggle theme" onClick={() => { setPrefDarkMode(!prefDarkMode) }}>
                            {prefDarkMode === false ? <Brightness2Icon /> : <Brightness5Icon />}
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <main>
                    <div>
                        <CardMedia className={classes.media} image={serverDetails.icon} title="Server icon" />
                    </div>
                </main>
            </ThemeProvider>
        </div>
    );
}