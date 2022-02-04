const configuration = require('./../configuration/serverConfig.json');
const express = require('express');
const app = express();

const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const Client = require('./schematics/Client');

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "../../frontend", "build")));
console.log(path.join(__dirname, "server/public"));
app.use('/assets', express.static(path.join(__dirname, "server/public")));

app.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, "../../frontend", "build", "index.html"));
});

app.listen(configuration.port, () => {
    console.log(`Server operational, ${configuration.https === true ? 'https' : 'http'}://localhost:${configuration.port}/`);
})

module.exports = class Server {

    constructor(client, options = {}) {
        this.client = client;
        this.server = app;
        app.post('/verify', (req, res) => this.#verifyRoute(req, res));
        app.post('/invite', (req, res) => this.#inviteRoute(req, res));
    }

    #verifyRoute(req, res) {
        console.log(req.get('token'));
        console.log(req.body);
        if (req.body.token) {
            const { body: { token } } = req;
            Client.verifyToken(token).then(verified => {
                console.log(verified);
                if (verified === true) {
                    Client.findByToken(token)
                        .then(records => {
                            console.log(records);
                            this.client.utils.fetchUserData(records[0].discord.userId)
                                .then(json => {
                                    console.log(json);
                                    res.send(json);
                                })
                        })
                        .catch(error => {
                            console.error(error);
                        })
                } else {
                    res.send({ message: 'invalid token' });
                }
            })
        } else {
            res.send({ message: 'invalid token' });
        }
    }

    #inviteRoute(req, res) {
        if (req.body.token) {
            console.log(req.body)
            const { body: { token, guildId } } = req;
            console.log(guildId);
            Client.verifyToken(token).then(verified => {
                console.log(verified);
                if (verified === true) {
                    Client.findByToken(token)
                        .then(records => {
                            const [target] = records;
                            this.client.utils.fetchInvite(target.discord.userId, guildId)
                                .then(message => {
                                    if (Object.keys(message).length > 0 && !message.error) {
                                        res.send(message);                                        
                                    } else {
                                        res.send({ message: 'missing permissions' });
                                    }
                                })
                        })
                        .catch(error => {
                            console.error(error);
                        })
                } else {
                    res.send({ message: 'invalid token' });
                }
            })
        } else {
            res.send({ message: 'invalid token' });
        }
    }

};