// This should go without prefice but this is a singleton class
const mongoose = require('mongoose');
const logger = require('./Logger');

mongoose.Promise = global.Promise;
let connected = false;
class Database {

	/**
     * Connects to the database
     *
     * @returns {boolean} true - connected without issue, false - failed to connect
     */
	async connect() {
		if (connected === false) {
			// Connect MongoDB at default port 27017.
			mongoose.connect('mongodb://localhost:27017/meowzers', {
				useNewUrlParser: true,
				useCreateIndex: true,
				useUnifiedTopology: true,
				autoIndex: false
			}, (err) => {
				if (!err) {
					logger.info('MongoDB Connection Succeeded.');
					connected = true;
				} else {
					logger.crit(`Error in DB connection: ${err}`);
					connected = false;
				}
				return connected;
			});
		} else {
			return true;
		}
	}

	/**
     *
     * @returns {boolean} if connected to database
     */
	isConnected() {
		return connected;
	}

}

let instance;
module.exports = class Singleton {

	getInstance() {
		if (!instance) {
			instance = new Database();
		}
		return instance;
	}

};
