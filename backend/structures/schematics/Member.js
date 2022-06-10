const mongoose = require('mongoose'); // Erase if already required
const logger = require('../Logger');

// Declare the Schema of the Mongo model
const memberSchema = new mongoose.Schema({
	memberId: {
		type: String,
		required: [true, 'You must supply memberId to Member']
	},
	supporter: {
		type: Boolean,
		default: false
	},
	roles: [{
		guildId: String,
		roles: [String]
	}]
});

// eslint-disable-next-line func-names
memberSchema.statics.getByMemberId = function (memberId) {
	return this.findOne({ memberId: memberId });
};

// eslint-disable-next-line func-names
memberSchema.statics.getRolesForGuildId = function (memberId, guildId, callback) {
	this.findOne({ memberId: memberId })
		.then(doc => {
			if (doc) {
				callback(doc.roles.find(el => el.guildId === guildId).roles);
				return;
			} else {
				callback();
				return;
			}
		});
};

// eslint-disable-next-line func-names
memberSchema.statics.updateRoleForGuildId = function (memberId, guildId, roles, callback) {
	this.findOne({ memberId: memberId }, (err, doc) => {
		if (err) {
			logger.error(err);
			return callback();
		}

		if (!doc) {
			this.create({
				memberId: memberId,
				roles: [{
					guildId: guildId,
					roles: roles
				}]
			}).then(newDoc => {
				callback(newDoc);
			});
		} else {
			//console.log(doc);
			const newArr = doc.roles;
			const index = newArr.findIndex(el => el.guildId === guildId);
			newArr[index === -1 ? 0 : index] = {
				roles: roles,
				guildId: guildId
			};
			this.updateOne({ memberId: memberId }, { $set: { roles: newArr } })
				.then(() => this.findOne({ memberId: memberId }, (err, newDoc) => callback(newDoc)));
		}
	});
};

// Export the model
module.exports = mongoose.model('member', memberSchema, 'member');
