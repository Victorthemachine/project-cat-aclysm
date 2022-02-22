import React from 'react';
import axios from 'axios';

import { Avatar, Card, CardHeader, CardActions, Button } from '@mui/material';

const UserCard = () => {

    const [userInfo, setUserInfo] = React.useState({});
    React.useEffect(() => {
        axios.post('http://localhost:8080/info/userinfo', {}, {
            withCredentials: true,
        })
            .then(res => {
                if (Object.keys(res.data).length > 0) {
                    setUserInfo(res.data);
                } else {
                    // Probably token expiration, refresh to make sure
                    window.location.reload();
                }
            })
            .then(err => {
                //Dunno promt maybe?
            });
    }, [])

    const handleLogOut = () => {
        document.cookie = "nya-bot-jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.reload();
    }

    console.log('What are the flavours today')
    console.log(document.cookie);

    return (
        <Card sx={{ display: 'flex', justifyContent: 'center', allignItems: 'center', direction: 'collumn' }}>
            <CardHeader
                avatar={
                    <Avatar src={userInfo.avatar} aria-label="Your profile picture" />
                }
                title={userInfo.username}
                subheader={`#${userInfo.discriminator}`}
            />
            <CardActions>
                <Button size="large" variant="contained" onClick={handleLogOut}>
                    Log out
                </Button>
            </CardActions>
        </Card>
    )
}

export default UserCard;