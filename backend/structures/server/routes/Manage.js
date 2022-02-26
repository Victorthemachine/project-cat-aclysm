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

    updateAccessibleRoles(req, res, next) {
        this.#infoRouteMiddleWare(req)
            .then(token => {
                // TODO: Fix all routes with the status codes instead returning empty objects
                // TODO: This route needs to supply rejects, as that is very much possible
                if (Object.keys(token).length === 0) return res.status(403).end();
                // This entire transaction should be safe, considering person has to auth through discord first anyway
                const user = this.client.users.cache.get(token.userId);
                // Just for my piece of mind
                if (Object.keys(user).length === 0) return res.status(500).end();
                if (!req.body.roles || !req.body.guildId || Object.keys(req.body.roles) === 0) return res.status(400).end();
                const guild = this.client.guilds.cache.get(req.body.guildId);
                if (!guild) return res.status(400).end();
                guild.members.fetch(user)
                    .then(member => {
                        if (user.id === guild.ownerId || member.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
                            res.status(202);
                            this.client.utils.updateAccessibleRoles(req.body.guildId, req.body.roles)
                                .then(fin => {
                                    res.status(200).end();
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

    updateSelfRoles(req, res, next) {
        this.#infoRouteMiddleWare(req)
            .then(token => {
                if (Object.keys(token).length === 0) return res.status(403).end();
                // This entire transaction should be safe, considering person has to auth through discord first anyway
                const user = this.client.users.cache.get(token.userId);
                // Just for my piece of mind
                if (Object.keys(user).length === 0) return res.status(500).end();
                if (!req.body.roles || !req.body.guildId || Array.isArray(req.body.roles) === false) return res.status(400).end();
                this.client.utils.applySelfAssignableRoles(req.body.guildId, user, req.body.roles)
                    .then(rejects => {
                        res.status(200).send({ rejected: rejects });
                    });
            })
    }

}