import React from 'react';
import { useIntl } from 'react-intl';
import axios from 'axios'

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { Alert, AlertTitle, Collapse, FormControl, NativeSelect, Grid, Paper } from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

import { Drawer } from '@mui/material';
import { Route, Routes } from 'react-router-dom';

import { ThemeContext } from '../../config/themes';
import { LocaleContext } from '../../config/locales/index';
import UserCard from '../UserCard/UserCard';
import ServerCard from '../ServerCard/ServerCard';
import RolePage from '../../subpages/RolePage';
import ManagePage from '../../subpages/ManagePage';

// TODO: learn breakpoints so it's responsive even on mobile
export default function ButtonAppBar(props) {
    const intl = useIntl();

    const [open, setOpen] = React.useState(false);
    const [userGuilds, setUserGuilds] = React.useState([]);
    const [showAlert, setShowAlert] = React.useState(false);
    const [alertSuccess, setAlertSuccess] = React.useState(false);
    const [guildInformation, setGuildInformation] = React.useState();

    if (showAlert === true) setTimeout(() => setShowAlert(false), 5000);

    const handleDrawerOpen = () => {
        open === true ? setOpen(false) : setOpen(true);
    }
    const { isDarkMode, toggleDarkMode } = React.useContext(ThemeContext);
    const { lang, availibleLangs, toggleLocale } = React.useContext(LocaleContext);

    React.useEffect(() => {
        axios.post('http://localhost:8080/info/userguilds', {}, {
            withCredentials: true,
        })
            .then(res => {
                //console.log('========New route========');
                //console.log(res.data);
                //console.log('=========================')
                let temp = [];
                for (let guildName in res.data) {
                    temp.push(<ServerCard popAlert={setShowAlert} alertType={setAlertSuccess} serverInfo={{ ...res.data[guildName], name: guildName }} />);
                }
                setUserGuilds(temp);
                setGuildInformation(res.data);
            })
            .then(err => {
                //Dunno promt maybe?
            });
    }, [])


    //Define styles for drawer and assorted
    const drawerWidth = 240;

    const drawerStyle = {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        //transition here if needed
    }

    const adjustedContentByDrawer = (open === true ? {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        //transition here if needed
    } : {
        //transition here if needed
    })

    return (
        <>
            <AppBar position="sticky" open={open} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} style={adjustedContentByDrawer}>
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={handleDrawerOpen}
                    >
                        {open === true ? <ChevronLeftIcon /> : <MenuIcon />}
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        {intl.formatMessage({ id: 'dashboard' })}
                    </Typography>
                    <div>
                        <FormControl sx={{ mr: 1 }}>
                            <NativeSelect
                                defaultValue={String(lang).toUpperCase()}
                                onChange={event => toggleLocale(event.target.value)}
                                sx={{ color: (theme) => theme.palette.primary.contrastText }}
                            >
                                {availibleLangs.map(el => <option color="text.primary" value={el}>{String(el).toUpperCase()}</option>)}
                            </NativeSelect>
                        </FormControl>
                        <IconButton sx={{ color: (theme) => theme.palette.primary.contrastText, mr: 2 }} onClick={toggleDarkMode}>
                            {isDarkMode === true ? <DarkModeIcon /> : <LightModeIcon />}
                        </IconButton>
                        <Button color="inherit" size='large' component="a" href="https://discord.com/api/oauth2/authorize?client_id=775667315706560533&permissions=8&scope=bot" target="_blank">Invite me!</Button>
                    </div>
                </Toolbar>
            </AppBar>
            <Drawer variant="persistent" anchor="left" open={open} style={drawerStyle} PaperProps={{ sx: { width: drawerWidth, bgcolor: theme => theme.palette.background.default } }}>
                <UserCard sx={{ minHeight: 1 / 4 }} />
                <Button fullWidth> Example </Button>
            </Drawer>
            <div style={{ ...adjustedContentByDrawer, height: '100vh' }}>
                <Paper sx={{ width: 1, minHeight: '100vh' }}>
                    <Collapse sx={{ zIndex: (theme) => theme.zIndex.appBar + 2 }} in={showAlert}>
                        <Alert severity={alertSuccess === true ? "success" : "error"}>
                            <AlertTitle>{intl.formatMessage({ id: 'invite_alert_title' })}</AlertTitle>
                            {intl.formatMessage({ id: `${alertSuccess === true ? 'invite_alert_success' : 'invite_alert_error'}` })}
                        </Alert>
                    </Collapse>
                    <Routes>
                        <Route path="/" exact element={
                            <Grid
                                container
                                sx={{ flexGrow: 1 }}
                                spacing={4}
                                justifyContent="center"
                                alignItems="stretch"
                            >
                                {userGuilds.map(el => {
                                    return (
                                        <Grid item xs={12} md={2}>
                                            {el}
                                        </Grid>
                                    )
                                })}
                            </Grid>
                        } />
                        <Route path="/roles" element={<RolePage guildInformation={guildInformation} />} />
                        <Route path="/manage" element={<ManagePage serverInfo={guildInformation} />} />
                    </Routes>
                    {props.children}
                </Paper>
            </div>
        </>
    );
}