import React from 'react';
import { useIntl } from 'react-intl';
import axios from 'axios';

import { Avatar, Card, CardHeader, CardActions, Button, Typography } from '@mui/material';

const UserCard = ({ serverInfo, popAlert, alertType }) => {
    const intl = useIntl();
    const handleInvite = () => {
        // TODO: gotta add invite action here
        console.log(`Trying to invite ppl to ${serverInfo.name} with ID:${serverInfo.guildId}`);
        axios.post('http://localhost:8080/info/invite', {
            guildId: serverInfo.guildId
        }, {
            withCredentials: true,
        })
            .then(res => {
                if (res.data.invite) {
                    navigator.clipboard.writeText(`${res.data.invite}`);
                    alertType(true);
                } else {
                    alertType(false);
                }
                popAlert(true);
            })
            .then(err => {
                //Dunno promt maybe?
            });
    }

    return (
        <Card variant="outlined" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <CardHeader
                avatar={
                    <Avatar src={serverInfo.guildAvatar} aria-label="Guild icon" />
                }
                title={serverInfo.name}
            />
            <Typography>
                {`${intl.formatMessage({ id: 'guild_position' })} ${serverInfo.position}`}
            </Typography>
            <CardActions>
                {/*Might need to add tooltip here*/}
                <Button
                    size="large"
                    variant="contained"
                    onClick={handleInvite}
                    disabled={serverInfo.invite.allowed === 'true' ? true : false}
                >
                    Invite
                </Button>
            </CardActions>
            <Card sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Typography>
                    {intl.formatMessage({ id: 'owner' })}
                </Typography>
                <CardHeader
                    avatar={
                        <Avatar src={serverInfo.owner.avatar} aria-label="Owner icon" />
                    }
                    title={`${serverInfo.owner.name}#${serverInfo.owner.discriminator}`}
                />
            </Card>
        </Card>
    )
}

export default UserCard;