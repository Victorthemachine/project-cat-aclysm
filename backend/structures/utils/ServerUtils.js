const { nanoid, customAlphabet } = require('nanoid/async');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
// Currently not possible to change length of your custom alphabet to my knowledge
// So it's fixed to what I use
const generateNumerals = customAlphabet('0123456789', 10);
const Client = require('../schematics/Client');
const CONSTANTS = require('../../configuration/botConstants');
const logger = require('../Logger');
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
	 * Second part dealing with JWT and other security.
	 * Current plan is to generate RSA SHA256 keys and encrypt that way.
	 * Prolly generate new ones every few days? Or something along those lines?
	 *
	 * @param {client} client Discord.js client
	 */
	constructor(client) {
		this.client = client;
		const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
		this.publicKey = publicKey;
		this.privateKey = privateKey;
		try {
			// Client.collection.drop();
		} catch (err) {
			logger.warn('Client collection is already empty');
		}
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
		if (Object.keys(relevant.auth).includes('url') === false) return {};
		Client.resetAuthByUserId(relevant.discord.userId);
		if (Date.now() - relevant.auth.createdAt > (CONSTANTS.milis.milisTime.minute * 15)) {
			return {};
		}
		return relevant.discord;
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
		if (Object.keys(relevant.auth).includes('url') === false) return {};
		Client.resetAuthByUserId(relevant.discord.userId);
		if (Date.now() - Date(relevant.auth.createdAt) > (CONSTANTS.milis.milisTime.minute * 15)) {
			return {};
		}
		return relevant.discord;
	}

	/**
	 * Ecrypts the provided data into JSON web token.
	 *
	 * @param {Object | string} data to encrypt
	 * @returns {string} token
	 */
	async encryptJWT(data) {
		// console.log('attempting to encrypt ', data);
		if (data !== Object(data)) {
			data = { data: data };
		}
		// console.log(data);
		return new Promise(resolve => {
			jwt.sign(data.toJSON(), this.privateKey, { algorithm: 'RS256', expiresIn: '12h' }, (err, token) => {
				if (err) {
					logger.error(err);
					resolve('');
				} else {
					resolve(token);
				}
			});
		});
	}

	/**
	 * Decrypts the provided JSON web token into readable data.
	 *
	 * @param {string} token to decrypt
	 * @returns {Object} data
	 */
	async decryptJWT(token) {
		return new Promise(resolve => {
			jwt.verify(token, this.publicKey, { algorithms: ['RS256'] }, (err, decodedData) => {
				if (err) {
					logger.error(err);
					resolve({});
				} else {
					resolve(decodedData);
				}
			});
		});
	}

};
