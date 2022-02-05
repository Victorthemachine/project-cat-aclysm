/* eslint-disable func-names */
const mongoose = require('mongoose');

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

clientSchema.statics.findByUserId = function (id) {
	return this.find({ discord: { userId: id } });
};

clientSchema.statics.findByUrl = function (url) {
	return this.find({ auth: { url: url } });
};

clientSchema.statics.findByPin = function (pin) {
	return this.find({ auth: { pin: pin } });
};

clientSchema.statics.resetAuthByUserId = function (id) {
	return this.updateOne({ discord: { userId: id } }, { auth: { url: '', pin: '' } });
};

clientSchema.statics.resetAuthByUrl = function (url) {
	return this.updateOne({ auth: { url: url } }, { auth: { url: '', pin: '' } });
};

clientSchema.statics.resetAuthByPin = function (pin) {
	return this.updateOne({ auth: { pin: pin } }, { auth: { url: '', pin: '' } });
};

clientSchema.statics.setAuthByUserId = function (id, auth) {
	return this.updateOne({ discord: { userId: id } }, { auth: { url: auth.url, pin: auth.pin, createdAt: Date.now() }});
};

// Export the model
module.exports = mongoose.model('Client', clientSchema);
