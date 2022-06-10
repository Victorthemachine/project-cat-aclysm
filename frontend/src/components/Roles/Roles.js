import React from 'react';
import { Button, List, Typography } from '@mui/material';
import { useIntl } from 'react-intl';
import axios from 'axios';

import Role from '../Role/Role'

const Roles = (props) => {
    const intl = useIntl();
    const [allRoles, setAllRoles] = React.useState();
    const [allChecked, setAllChecked] = React.useState();
    //console.log('===============Uhhh cmon gimme a break===============');
    //console.log(allRoles);
    //console.log(allChecked);
    React.useEffect(() => {
        axios.post('http://localhost:8080/info/selfroles', {
            guildId: props.serverInfo.guildId
        }, {
            withCredentials: true
        }).then(res => {
            setAllRoles(res.data.roles);
            setAllChecked(Object.fromEntries(new Map(res.data.roles.map(el => {
                return [el.id, el.claimed]
            }))));
        }).then(err => {
            //...
        })

    }, [props.serverInfo.guildId]);

    const setChecked = (roleId) => {
        const temp = JSON.parse(JSON.stringify(allChecked));
        temp[roleId] = temp[roleId] === true ? false : true;
        setAllChecked(temp);
    }

    const handleSubmit = () => {
        axios.post('http://localhost:8080/manage/applyroles', {
            guildId: props.serverInfo.guildId,
            roles: allRoles ? Array.isArray(allRoles) ? (allRoles.filter(el => el.claimed !== allChecked[el.id])).map(el => el.id) : [] : []
        }, {
            withCredentials: true
        }).then(res => {
            //console.log(res.data);
            // Announce rejected roles and also make sure they dont get checked
            const copy = JSON.parse(JSON.stringify(allRoles));
            setAllRoles(copy.map(el => {
                el.claimed = allChecked[el.id];
                return el;
            }));
        }).then(err => {
            // ...
        })
    }

    const listItems = allChecked ? allRoles ? Array.isArray(allRoles) ? allRoles.map(el => {
        return <Role checked={allChecked[el.id] ? allChecked[el.id] : false} role={el} setChecked={setChecked} />
    }) : [] : [] : []
    //console.log('=====================================================');

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
            <div style={{ width: '50%', display: 'flex', justifyContent: 'center', alignContent: 'center', flexDirection: 'column' }}>
                <List sx={{ bgcolor: 'background.paper' }} subheader={<Typography variant="h5">{`${intl.formatMessage({ id: 'role_header' })} ${props.serverInfo.guildName}`}</Typography>} >
                    {listItems}
                </List>
                <div style={{ paddingRight: '25%', paddingLeft: '25%', width: '50%', display: 'flex', justifyContent: 'center' }}>
                    <Button size="large" variant="contained" sx={{ width: 1 / 2 }} onClick={handleSubmit} >
                        {intl.formatMessage({ id: 'submit_roles' })}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Roles;