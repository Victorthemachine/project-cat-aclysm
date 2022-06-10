const { Permissions } = require('discord.js');
const logger = require('../../Logger');
const BotRoute = require('../structures/BotRoute');

module.exports = class extends BotRoute {

    // eslint-disable-next-line no-useless-constructor
    constructor(client) {
        super(client);
    }

    async #infoRouteMiddleWare(req) {
        if (!Object.keys(req.cookies).includes('nya-bot-jwt')) return {};
        const tokenData = await this.client.serverUtils.decryptJWT(req.cookies['nya-bot-jwt'])
        if (Object.keys(tokenData).length > 0) {
            return tokenData;
        } else {
            return {};
        }
    }

    fetchUserInfo(req, res, next) {
        this.#infoRouteMiddleWare(req)
            .then(token => {
                if (Object.keys(token).length === 0) return res.send({});
                // This entire transaction should be safe, considering person has to auth through discord first anyway
                const user = this.client.users.cache.get(token.userId);
                // Just for my piece of mind
                if (Object.keys(user).length > 0) {
                    return res.send({
                        avatar: user.displayAvatarURL({ dynamic: true }),
                        username: user.username,
                        discriminator: user.discriminator
                    })
                }
                return res.send({});
            })
    }

    fetchUserGuilds(req, res, next) {
        this.#infoRouteMiddleWare(req)
            .then(token => {
                //console.log('============User guild route============')
                //console.log(token);
                if (Object.keys(token).length === 0) return res.send({});
                this.client.utils.fetchUserGuilds(token.userId)
                    .then(data => {
                        res.send(data);
                        //console.log('========================================')
                    });
            })

    }

    fetchInvite(req, res, next) {
        this.#infoRouteMiddleWare(req)
            .then(token => {
                //console.log('============User invite route============')
                //console.log(token);
                if (Object.keys(token).length === 0) return res.send({});
                if (!req.body.guildId) return res.send({});
                this.client.utils.fetchGuildInvite(token.userId, req.body.guildId)
                    .then(data => {
                        res.send(data);
                        //console.log('=========================================')
                    });
            })
    }

    fetchSelfAssignRoles(req, res, next) {
        this.#infoRouteMiddleWare(req)
            .then(token => {
                // TODO: Fix all routes with the status codes instead returning empty objects
                if (Object.keys(token).length === 0) return res.status(403).end();
                // This entire transaction should be safe, considering person has to auth through discord first anyway
                const user = this.client.users.cache.get(token.userId);
                // Just for my piece of mind
                if (Object.keys(user).length === 0) return res.status(500).end();
                if (!req.body.guildId) return res.status(400).end();
                this.client.utils.fetchSelfAssignableRoles(req.body.guildId, user)
                    .then(roles => {
                        res.send({ roles: roles });
                    });
            })
    }

    fetchManageRoles(req, res, next) {
        this.#infoRouteMiddleWare(req)
            .then(token => {
                // TODO: Fix all routes with the status codes instead returning empty objects
                if (Object.keys(token).length === 0) return res.status(403).end();
                // This entire transaction should be safe, considering person has to auth through discord first anyway
                const user = this.client.users.cache.get(token.userId);
                // Just for my piece of mind
                if (Object.keys(user).length === 0) return res.status(500).end();
                if (!req.body.guildId) return res.status(400).end();
                const guild = this.client.guilds.cache.get(req.body.guildId);
                if (!guild) return res.status(400).end();
                guild.members.fetch(user)
                    .then(member => {
                        if (user.id === guild.ownerId || member.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
                            this.client.utils.fetchAllRolesForManage(req.body.guildId, user)
                                .then(roles => {
                                    res.send({ roles: roles });
                                });
                            return;
                        } else {
                            return res.status(403).end();
                        }
                    })
                    .catch(err => {
                        logger.error(err);
                        res.status(500).end();
                    })
            })
    }

}