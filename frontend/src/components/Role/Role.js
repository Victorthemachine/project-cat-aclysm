import React from 'react';
import { ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, Checkbox, Avatar } from '@mui/material';

// TODO: Implement the draggable part, issue is that it wouldn't be useble on mobile
const Role = (props) => {
    return (
        <ListItem sx={{ flexGrow: 1, bgcolor: props.role.color }}>
            <ListItemButton onClick={() => props.setChecked(props.role.id)}>
                <ListItemIcon>
                    <Checkbox checked={props.checked} />
                </ListItemIcon>
            </ListItemButton>
            <ListItemText primary={props.role.name} />
            {props.role.avatar
                ? <ListItemAvatar>
                    <Avatar src={props.role.avatar} aria-label="Role icon" />
                </ListItemAvatar>
                : <></>
            }
        </ListItem>
    )
}

export default Role;