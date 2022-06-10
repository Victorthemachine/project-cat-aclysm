import React from 'react';
import { useIntl } from 'react-intl';
import { createSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { Avatar, Card, CardHeader, CardActions, Button, Typography } from '@mui/material';

const UserCard = ({ serverInfo, popAlert, alertType }) => {
    const intl = useIntl();
    const navigate = useNavigate();
    const params = { guild: serverInfo.guildId };

    const handleInvite = () => {
        // TODO: gotta add invite action here
        //console.log(`Trying to invite ppl to ${serverInfo.name} with ID:${serverInfo.guildId}`);
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
    const handleRedirect = (pathname) => {
        navigate({
            pathname: `/dashboard/${pathname}`,
            search: `?${createSearchParams(params)}`,
          });    
    }

    return (
        <Card variant="outlined" sx={{ bgcolor: (theme) => theme.palette.background.default, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <CardHeader
                avatar={
                    <Avatar src={serverInfo.guildAvatar} aria-label="Guild icon" />
                }
                title={serverInfo.name}
            />
            <Typography>
                {`${intl.formatMessage({ id: 'guild_position' })} ${serverInfo.position}`}
            </Typography>
            <CardActions >
                {/*Might need to add tooltip here*/}
                <div style={{ display: 'grid'}}>
                    <Button
                        sx={{ width: 1 }}
                        size="large"
                        variant="contained"
                        onClick={handleInvite}
                        disabled={serverInfo.invite.allowed === true ? false : true}
                    >
                        {intl.formatMessage({ id: "invite_btn" })}
                    </Button>
                    <Button
                        sx={{ width: 1 }}
                        size="large"
                        variant="contained"
                        onClick={() => handleRedirect('manage')}
                        disabled={(Object.values(serverInfo.userPerms.manage).filter(el => el === true)).length === 0}
                    >
                        {intl.formatMessage({ id: "manage_btn" })}
                    </Button>
                    <Button
                        sx={{ width: 1 }}
                        size="large"
                        variant="contained"
                        onClick={() => handleRedirect('roles')}
                        disabled={serverInfo.userPerms.roles.length === 0}
                    >
                        {intl.formatMessage({ id: "roles_btn" })}
                    </Button>
                </div>
            </CardActions>
            <Card sx={{ bgcolor: (theme) => theme.palette.background.default, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
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