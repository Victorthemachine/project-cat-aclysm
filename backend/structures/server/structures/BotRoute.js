/**
 * @typedef {import('../../NyaBotClient')} client
 */


module.exports = class BotRoute {

	/**
     * Created to allow server (server route) to use bot functionallity.
     *
     * @param {client} client Discord.js client
     */
	constructor(client) {
		// append client
		this.client = client;
	}

};
