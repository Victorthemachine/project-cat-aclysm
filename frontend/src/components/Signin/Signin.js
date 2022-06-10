import React from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/styles';
import { Button, Typography, TextField, IconButton, Alert, AlertTitle, Collapse, Tooltip, Paper } from '@mui/material';
import { VisibilityOff, Visibility, Close as CloseIcon } from '@mui/icons-material';
import axios from 'axios';

const Signin = () => {
    const intl = useIntl();
    const navigate = useNavigate();
    const theme = useTheme()
    const [entryPin, setEntryPin] = React.useState('')
    const [showPin, setShowPin] = React.useState(false);
    const [open, setOpen] = React.useState(false);

    const handleClickShowPin = () => {
        setShowPin(showPin === true ? false : true);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:8080/auth/verify', {
            pin: entryPin
        }, {
            withCredentials: true,
        })
            .then(res => {
                if (res.data.auth === true) {
                    //Redirect to dash
                    //localStorage.setItem('nya-bot-auth', 'true');
                    navigate('/dashboard');
                } else {
                    //Add prompt to tell sign in didn't work
                    setOpen(true);
                }
            })
            .then(err => {
                //Dunno promt maybe?
            });
    }

    //TODO: Currently PIN length is set to 10 but that is subject to change
    //TODO: Make the redirect match the bot ID
    return (
        <Paper
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: `100vh`,
            }}
        >
            <Collapse in={open}>
                <Alert
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                                setOpen(false);
                            }}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                    severity="error"
                >
                    <AlertTitle>Invalid PIN</AlertTitle>
                    Check the PIN you received in Discord - <strong>only Nya Bot#8111 can give out PINs!</strong>
                </Alert>
            </Collapse>
            <Paper sx={{ bgcolor: theme => theme.palette.background.default, width: 1 / 4, height: '50vh' }}>
                <div style={{ marginLeft: '25%', width: '50%', height: '100%', display: 'flex', justifyContent: 'center', alignContent: 'center', flexDirection: 'column' }}>
                    <Typography align="center" component="h1" variant="h3">
                        {intl.formatMessage({ id: 'sign_in' })}
                    </Typography>
                    <br/>
                    <br/>
                    <Typography align="justify" variant="body1">
                        {intl.formatMessage({ id: 'sign_in_context' })}
                    </Typography>
                    <br/>
                    <form
                        style={{ marginTop: 1 }}
                        onSubmit={handleSubmit}
                        noValidate
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                allignItems: "center"
                            }}
                        >
                            <TextField
                                value={entryPin}
                                onInput={(e) => setEntryPin(e.target.value)}
                                variant="outlined"
                                margin="normal"
                                required
                                error={entryPin.length !== 10 && entryPin.length !== 0}
                                helperText={entryPin.length !== 10 && entryPin.length !== 0 ? intl.formatMessage({ id: 'invalid_entry_pin' }) : ''}
                                name="entryPin"
                                label={intl.formatMessage({ id: 'entry_pin' })}
                                type={showPin === true ? "text" : "password"}
                                id="entryPin"
                                autoComplete="off"
                            />
                            <IconButton
                                children={showPin === true ? <VisibilityOff /> : <Visibility />}
                                onClick={handleClickShowPin}
                                sx={{ color: theme => theme.palette.primary.contrastText }}
                            />
                        </div>
                        <br/>
                        <Tooltip open={entryPin.length !== 10 && entryPin.length !== 0 ? true : false} title={intl.formatMessage({ id: 'invalid_entry_pin' })}>
                            <span>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    style={{ marginTop: 2 }}
                                    disabled={entryPin.length !== 10 && entryPin.length !== 0 ? true : false}
                                >
                                    {intl.formatMessage({ id: 'submit_pin' })}
                                </Button>
                            </span>
                        </Tooltip>
                        <br/>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            style={{ marginTop: 2 }}
                            component="a"
                            href="discord://discord.com/channels/@me/878465860421976134"
                        >
                            {intl.formatMessage({ id: 'to_discord' })}
                        </Button>
                    </form>
                </div>
            </Paper>
        </Paper>
    )
}

export default Signin;