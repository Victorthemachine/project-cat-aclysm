import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { ButtonGroup, CardActionArea, Grid } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

import axios from 'axios';

const useStyles = makeStyles({
    grid: {
        wrap: 'nowrap'
    },
    alert: {

    }
});
let invite = '';

async function getInvite(token, id) {
    return new Promise(resolve => {
        axios.post('http://localhost:8080/invite', {
            token: token,
            guildId: id
        })
            .then(function (response) {
                console.log(response);
                invite = response.data.invite;
                resolve(invite);
            })
            .catch(function (error) {
                console.log(error);
            });
    })
}

export default function ServerCard(props) {
    const classes = useStyles();
    const [visible, setVisible] = useState(false)

    function copyEvent(toCopy) {
        console.log(toCopy);
        navigator.clipboard.writeText(toCopy);
        setVisible(true);
    }
    console.log(`Invitable: ${props.details.invitable}`);
    console.log(props.details.invitable);

    return (
        <>
            {visible === true ? <Alert className={classes.alert} severity="info" onClose={() => setVisible(false)}>Copied invite to your clipboard</Alert> : <></>}
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={1}
            >
                <Card className={classes.root}>
                    <CardMedia className={classes.media} title="Contemplative Reptile">
                        <img src={props.details.icon == null ? 'http://localhost:8080/altimage.jpg' : props.details.icon} alt={'I can\'t code for shit'} style={{ borderRadius: '50%', height: 128 }}></img>
                    </CardMedia>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            {props.details.name}
                        </Typography>
                    </CardContent>
                </Card>
                <Card className={classes.root}>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            Your position: {props.details.position}
                        </Typography>
                    </CardContent>
                    <CardActionArea>
                        <ButtonGroup
                            orientation="vertical"
                            color="primary"
                            size="medium"
                            aria-label="vertical contained primary button group"
                            variant="contained"
                        >
                            <Button
                                disabled={props.details.invitable === true ? false : true}
                                onClick={() => props.details.invitable === true ? getInvite(props.token, props.details.id).then(inviteUrl => copyEvent(inviteUrl)) : console.log('Button is disabled')}
                            >
                                INVITE
                            </Button>
                            <Button>ROLES</Button>
                            <Button>BOT SETTINGS</Button>
                            <Button>BANS</Button>
                        </ButtonGroup>
                    </CardActionArea>
                </Card>
            </Grid>
        </>
    );
}