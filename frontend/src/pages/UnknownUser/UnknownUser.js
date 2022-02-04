import { Button, TextField, Typography, InputAdornment, IconButton } from '@mui/material'
import Page from 'material-ui-shell/lib/containers/Page'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from 'base-shell/lib/providers/Auth'
import { useNavigate, useLocation } from 'react-router-dom'
import { useIntl } from 'react-intl'
import { useMenu } from 'material-ui-shell/lib/providers/Menu'
import { useTheme } from '@mui/material/styles'
import CustomPaper from '../../components/CustomPaper'
import { VisibilityOff, Visibility } from '@mui/icons-material'

const SignIn = ({ redirectTo = '/' }) => {
    const intl = useIntl()
    const theme = useTheme()
    const navigate = useNavigate()
    let location = useLocation()
    const [username, setUsername] = useState('')
    const [entryPin, setEntryPin] = useState('')
    const [showPin, setShowPin] = useState(false);
    const { toggleThis } = useMenu()
    const { setAuth } = useAuth()

    function handleSubmit(event) {
        event.preventDefault()
        authenticate({
            displayName: 'User',
            email: username,
        })
    }

    const handleClickShowPin = () => {
        setShowPin(showPin === true ? false : true);
    }

    /**
     * Replace this with auth based on cookies with backend
     * @param {*} user 
     */
    const authenticate = (user) => {
        setAuth({ isAuthenticated: true, ...user })
        toggleThis('isAuthMenuOpen', false)

        let from = new URLSearchParams(location.search).get('from')

        if (from) {
            navigate(from, { replace: true })
        } else {
            navigate(redirectTo, { replace: true })
        }
    }

    //TODO: Currently PIN length is set to 10 but that is subject to change
    //TODO: Make the redirect match the bot ID
    return (
        <Page pageTitle={intl.formatMessage({ id: 'sign_in' })}>
            <CustomPaper elevation={6}>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: `100%`,
                    }}
                >
                    <Typography component="h1" variant="h5">
                        {intl.formatMessage({ id: 'sign_in' })}
                    </Typography>
                    <Typography variant="body1">
                        {intl.formatMessage({ id: 'sign_in_context' })}
                    </Typography>
                    <form
                        style={{ marginTop: theme.spacing(1) }}
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
                                type={showPin ? "text" : "password"}
                                id="entryPin"
                                autoComplete="off"
                            />
                            <IconButton
                                children={showPin ? <VisibilityOff /> : <Visibility />}
                                onClick={handleClickShowPin}
                            />
                        </div>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                style={{ margin: theme.spacing(3, 0, 2) }}
                            >
                                {intl.formatMessage({ id: 'submit_pin' })}
                            </Button>
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                style={{ margin: theme.spacing(3, 0, 2) }}
                                component="a"
                                href="discord://discord.com/channels/@me/878465860421976134"
                            >
                                {intl.formatMessage({ id: 'to_discord' })}
                            </Button>
                    </form>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                width: '100%',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Link to="/password_reset">
                                {intl.formatMessage({ id: 'forgot_password' })}?
                        </Link>
                            <Link to="/signup">
                                {intl.formatMessage({ id: 'registration' })}
                            </Link>
                        </div>
                </div>
            </CustomPaper>
        </Page>
    )
}

export default SignIn
