import React from 'react';
import { Avatar, Button, List, ListItem, ListItemAvatar, ListItemText, NativeSelect, Typography, Paper } from '@mui/material';
import { useIntl } from 'react-intl';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

import Loading from '../pages/Loading/Loading';

const RoleListForManage = ({ roles, compStates, handleSelectEvent, handleSubSelectEvent }) => {
    //console.log('=====Ass munching is over=====');
    //console.log(roles);
    //console.log(compStates);
    //console.log('==============================')
    const intl = useIntl();
    return (
        Array.isArray(roles) === true
            ? (
                <div style={{ paddingLeft: '25%', paddingRight: '25%', width: '50%', display: 'flex', justifyContent: 'center', alignContent: 'center', flexDirection: 'column' }}>
                    <List sx={{ bgcolor: 'background.paper' }} subheader={<Typography variant="h5">{intl.formatMessage({ id: 'manage_role_list_header' })}</Typography>} >
                        {roles.map(el => {
                            return (
                                <ListItem sx={{ flexGrow: 1, bgcolor: el.color }}>
                                    <ListItemText primary={<Typography variant="h5" sx={{ fontWeight: 'bold' }}>{el.name}</Typography>} />
                                    {el.avatar
                                        ? <ListItemAvatar>
                                            <Avatar src={el.avatar} aria-label="Role icon" />
                                        </ListItemAvatar>
                                        : <></>
                                    }
                                    {
                                        compStates[el.id].category === 'specific' && compStates[el.id].parent
                                            ? <NativeSelect
                                                defaultValue={(roles.find(elem => elem.id === compStates[el.id].parent)).id}
                                                value={roles.find(elem => elem.id === compStates[el.id].parent).id}
                                                inputProps={{
                                                    name: 'rule',
                                                }}
                                                onChange={(event) => handleSubSelectEvent(event.target.value, el.id)}
                                                sx={{ fontWeight: 'bold', fontVariant: 'h5' }}
                                            >
                                                {roles.filter(elem => elem.id !== el.id).map(element => <option style={{ fontWeight: 'bold', fontVariant: 'h5' }} value={element.id}>{element.name}</option>)}
                                            </NativeSelect>
                                            : <></>
                                    }
                                    <NativeSelect
                                        defaultValue={'unassigned'}
                                        value={compStates[el.id].category}
                                        inputProps={{
                                            name: 'category',
                                        }}
                                        onChange={(event) => handleSelectEvent(event.target.value, el.id)}
                                        sx={{ fontWeight: 'bold', fontVariant: 'h5' }}
                                    >
                                        <option style={{ fontWeight: 'bold', fontVariant: 'h5' }} value={'any'}>Anyone</option>
                                        <option style={{ fontWeight: 'bold', fontVariant: 'h5' }} value={'specific'}>Only with role</option>
                                        <option style={{ fontWeight: 'bold', fontVariant: 'h5' }} value={'unassigned'}>None</option>
                                    </NativeSelect>
                                </ListItem>
                            )
                        })}
                    </List>
                </div >
            )
            : <></>
    )

}

const ManagePage = ({ serverInfo }) => {
    const intl = useIntl();
    const [searchParams] = useSearchParams();
    const [loaded, setLoaded] = React.useState(false);
    const [pageData, setPageData] = React.useState();
    const [roleCompsState, setRoleCompsState] = React.useState();
    let keyName = '';

    if (serverInfo) {
        for (let i in serverInfo) {
            if (serverInfo[i].guildId === searchParams.get('guild')) keyName = i;
        }
    }
    //console.log('=========Manage panel=========');
    //console.log(pageData);
    //console.log(roleCompsState);
    //console.log(keyName);
    React.useEffect(() => {
        if (!keyName) return;
        //console.log(serverInfo);
        if (serverInfo[keyName].userPerms.manage.roles === true) {
            axios.post('http://localhost:8080/info/manageroles', {
                guildId: searchParams.get('guild')
            }, {
                withCredentials: true
            }).then(res => {
                //console.log(res.data.roles);
                const temp = {
                    roles: {}
                };
                res.data.roles.forEach(el => {
                    temp.roles[el.id] = {
                        category: el.category,
                        parent: el.parent ? el.parent : ''
                    }
                })
                setPageData(prevState => ({ ...prevState, roles: res.data.roles }));
                setRoleCompsState(temp)
                setLoaded(true);
            }).then(err => {
                //...
            })

        }
    }, [keyName, serverInfo, searchParams]);

    const handleSelectEvent = (value, id) => {
        //console.log('Are you to blame? ', value)
        const temp = JSON.parse(JSON.stringify(roleCompsState));
        temp.roles[id].category = value;
        if (value === 'specific') {
            temp.roles[id].parent = (pageData.roles.filter(el => el.id !== id))[0].id;
        }
        setRoleCompsState(temp);
    }

    const handleSubSelectEvent = (value, id) => {
        const temp = JSON.parse(JSON.stringify(roleCompsState));
        temp.roles[id].parent = value;
        setRoleCompsState(temp);
    }

    const handleSubmit = () => {
        const any = [];
        const specific = [];
        for (let i in roleCompsState.roles) {
            if (roleCompsState.roles[i].category === 'any') {
                any.push(i);
            } else if (roleCompsState.roles[i].category === 'specific') {
                const index = specific.findIndex(el => el.roleId === roleCompsState.roles[i].parent);
                if (index === -1) {
                    specific.push({
                        roleId: roleCompsState.roles[i].parent,
                        roles: [i]
                    });
                } else {
                    specific[index].roles.push(i);
                }
            }
        }
        //console.log('Bruh')
        //console.log(any)
        //console.log(specific);

        axios.post('http://localhost:8080/manage/updateroles', {
            guildId: searchParams.get('guild'),
            roles: {
                any: any,
                specific: specific
            }
        }, {
            withCredentials: true
        }).then(res => {
            //console.log(res.status)
        }).then(err => {
            //console.log('Oh not again');
            //console.log(err)
        })
    }
    // <Paper sx={{ width: 7/8, height: '100vh', bgcolor: (theme) => theme.palette.background.default, zIndex: 1 }} />
    return (
        loaded === true
            ? (
                <div style={{ display: 'flex', alignSelf: 'center', justifyContent: 'center', alignContent: 'center', flexDirection: 'column' }}>
                    <RoleListForManage zIndex={2} roles={pageData.roles} compStates={roleCompsState.roles} handleSelectEvent={handleSelectEvent} handleSubSelectEvent={handleSubSelectEvent} />
                    <div style={{ paddingRight: '25%', paddingLeft: '25%', width: '50%', display: 'flex', justifyContent: 'center' }}>
                        <Button size="large" onClick={handleSubmit} variant="contained" sx={{ width: 1 / 2 }}>{intl.formatMessage({ id: 'manage_submit_btn' })}</Button>
                    </div>
                </div>
            )
            : <Loading />
    )
}

export default ManagePage;