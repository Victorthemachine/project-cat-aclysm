import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Drawer } from '@mui/material';

export default function ButtonAppBar(props) {
    const [open, setOpen] = React.useState(false);
    const handleDrawerOpen = () => {
        open === true ? setOpen(false) : setOpen(true);
    }
    return (
        <div style={{
            position: 'sticky',
            left: 0,
            right: 0,
            top: 0,
            display: 'flex'
        }}>
            <AppBar open={open}>
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={handleDrawerOpen}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Dashboard
                    </Typography>
                    <Button color="inherit" component="a" href="https://discord.com/api/oauth2/authorize?client_id=775667315706560533&permissions=8&scope=bot" target="_blank">Invite me!</Button>
                </Toolbar>
            </AppBar>
            <Drawer variant="persistent" anchor="left" open={open}>
                {props.user
                    ? <div>TODO{/*just render everything normally */}</div>
                    : <Typography>You need to sign in first!</Typography>
                }
            </Drawer>
        </div>
    );
}