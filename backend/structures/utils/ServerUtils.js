const { nanoid, customAlphabet } = require('nanoid/async');
// Currently not possible to change length of your custom alphabet to my knowledge
// So it's fixed to what I use
const generateNumerals = customAlphabet('0123456789', 10);
const Client = require('../schematics/Client');
const CONSTANTS = require('../../configuration/botConstants');
/**
 * @typedef {import('../NyaBotClient')} client
 * @typedef {import('mongoose').Query} Query
 */

module.exports = class ServerUtils {

	/**
     * Normally you would require the DB or smt
     * But since it is mongoose we can just require the schema
     * Not to mention client hosts all singleton instances
     *
     * @param {client} client Discord.js client
     */
	constructor(client) {
		this.client = client;
	}

	/**
     * Generates custom URL for user.
     * These get discard after timeout or use so probability of collision or bruteforce
     * is close to zero
     *
     * @returns {string} unique URL
     */
	async generateUrl() {
		return await nanoid(25);
	}

	/**
     * Generates the PIN for users to autenthicate themselves with.
     * It's currently 10 digits long
     *
     * @returns {string} PIN
     */
	async generateNumeralPin() {
		return await generateNumerals();
	}

	/**
     * Creates the authentification options for the user.
     * User is defined by id (snowflake)
     *
     * @param {string} userId id of the user
     * @returns {{ url: string, pin: string }} authentication object
     */
	async createAuthOption(userId) {
		const authOptions = {
			url: await nanoid(25),
			pin: await generateNumerals()
		};
		Client.setAuthByUserId(userId, authOptions);
		return authOptions;
	}

	/**
     * Removes auth options, i.e. removes URL and PIN,
     *
     * @param {string} userId id of the user
     * @returns {Query} updated document
     */
	async removeAuthOption(userId) {
		return Client.resetAuthByUserId(userId);
	}

	/**
     * Verifies that URL exists and isn't expired.
     * If all of those conditions pass returns User document, otherwise undefined.
     *
     * @param {string} url Auth URL
     * @returns {Query | undefined} User document
     */
	async verifyUrl(url) {
		const query = await Client.findByUrl(url);
		if (query.length === 0) return {};
		const relevant = query.shift();
		if (!relevant.auth.url) return {};
		Client.resetAuthByUrl(url);
		if (Date.now() - relevant.auth.createdAt > (CONSTANTS.milis.milisTime.minute * 15)) {
			return {};
		}
		return query.discord;
	}

	/**
     * Verifies PIN code for length, expiration and actually being correct.
     * If all of those conditions are met then returns user document, otherwise undefined.
     *
     * @param {string} pin 10 digit PIN code
     * @returns {Query | undefined} User document
     */
	async verifyPin(pin) {
		if (pin.length !== 10) return {};
		const query = await Client.findByPin(pin);
		if (query.length === 0) return {};
		const relevant = query.shift();
		if (!relevant.auth.url) return {};
		Client.resetAuthByPin(pin);
		if (Date.now() - relevant.auth.createdAt > (CONSTANTS.milis.milisTime.minute * 15)) {
			return {};
		}
		return query.discord;
	}

};
