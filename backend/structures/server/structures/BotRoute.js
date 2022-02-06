const express = require('express');
const { Router } = express;
/**
 * @typedef {import('../../NyaBotClient')} client
 */


module.exports = class BotRoute extends Router {

	/**
     * Created to allow server (server route) to use bot functionallity.
     *
     * @param {client} client Discord.js client
     */
	constructor(client) {
		// init router
		super();
		// append client
		this.client = client;
	}

};
