/* eslint-disable func-names */
const mongoose = require('mongoose');
const logger = require('../Logger');

// auth is generate by utils, doesn't need validation or anything
// it's always correct because of nanoid
var clientSchema = new mongoose.Schema({
	auth: {
		url: String,
		pin: String,
		createdAt: {
			type: Date,
			default: Date.now()
		}
	},
	discord: {
		userId: String,
		// Like this might be a bit silly but I think overall might save time?
		guildId: [String],
		supporter: {
			type: Boolean,
			default: false
		}
	}
}, { timestamps: true });

clientSchema.statics.findByUserId = function (id, cb) {
	return this.find({ 'discord.userId': id }, cb);
};

clientSchema.statics.findByUrl = function (url, cb) {
	return this.find({ 'auth.url': url }, cb);
};

clientSchema.statics.findByPin = function (pin, cb) {
	return this.find({ 'auth.pin': pin }, cb);
};

clientSchema.statics.resetAuthByUserId = function (id, cb) {
	return new Promise(resolve => {
		this.find({ 'discord.userId': id })
			.then(queryArr => {
				//console.log(queryArr);
				if (queryArr.length === 0) {
					resolve(this.create({ discord: { userId: id }, auth: { url: '', pin: '' } }));
				} else {
					resolve(this.updateOne({ 'discord.userId': id }, { auth: { url: '', pin: '' } }, cb));
				}
			})
			.catch(err => {
				logger.error(err);
				resolve();
			});
	});
};

clientSchema.statics.resetAuthByUrl = function (url, cb) {
	return this.updateOne({ 'auth.url': url }, { auth: { url: '', pin: '' } }, cb);
};

clientSchema.statics.resetAuthByPin = function (pin, cb) {
	return this.updateOne({ 'auth.pin': pin }, { auth: { url: '', pin: '' } }, cb);
};

clientSchema.statics.setAuthByUserId = function (id, authOpts, cb) {
	return new Promise(resolve => {
		this.find({ 'discord.userId': id })
			.then(queryArr => {
				//console.log(queryArr);
				if (queryArr.length === 0) {
					resolve(this.create({ discord: { userId: id }, auth: { url: authOpts.url, pin: authOpts.pin, createdAt: Date.now() } }));
				} else {
					resolve(this.updateOne({ 'discord.userId': id }, { auth: { url: authOpts.url, pin: authOpts.pin, createdAt: Date.now() } }, cb));
				}
			})
			.catch(err => {
				logger.error(err);
				resolve();
			});
	});
};

// Export the model
module.exports = mongoose.model('client', clientSchema, 'client');
