const mongoose = require('mongoose');
const logger = require('../Logger');

// TODO: Basically I fucked the entire mongo thing I got, QUERY !== PROMISE, so it isn't async meaning when I use it async it just executes it twice fucking it all up
// TODO: Implement overrides later not important right now
const serverConfigSchema = new mongoose.Schema({
	guildId: {
		type: String,
		required: [true, 'You must supply guildId for ServerConfig']
	},
	joinedAt: {
		type: Date,
		default: Date.now()
	},
	detectModTiers: {
		type: Boolean,
		default: true
	},
	// If this is defined and detectModTiers is true => override for these roles/users
	modTiers: {
		// Probably worth having, bool values regarding if the arrays are empty
		// Cuts down the checks dramatically
		owner: {
			roles: [String],
			users: [String]
		},
		admin: {
			roles: [String],
			users: [String]
		},
		mod: {
			roles: [String],
			users: [String]
		}
	},
	premium: {
		isPremium: {
			type: Boolean,
			default: false
		},
		premiumBy: [String]
	},
	inviteRules: {
		shouldAsk: Boolean,
		ask: [String],
		// Override invite perms
		allowedToInvite: [String],
		rolesOnJoin: [String],
		logInvites: {
			type: Boolean,
			default: false
		}
	},
	memberRoles: {
		// Everything about roles related to members
		// auto giving, managing accessibility etc.

		selfAssign: {
			any: [String],
			// I'd rather not have array here, but it's not possible as far as I know
			specific: [{
				roleId: String,
				roles: [String]
			}]
		}
	},
	admin: {
		muteRole: String
	}
});

async function verifyEntry(instance, guildId) {
	return new Promise(resolve => {
		instance.find({ guildId: guildId })
			.then(queryArr => {
				console.log('Is the goddamn array empty or what the actual fuck');
				console.log(queryArr);
				if (queryArr.length === 0) {
					instance.create({ guildId: guildId })
						.then(doc => {
							resolve(doc);
						})
						.catch(err => {
							logger.error(err);
							resolve({});
						});
				} else {
					resolve(queryArr.shift());
				}
			})
			.catch(err => {
				logger.error(err);
				resolve({});
			});
	});
}

// eslint-disable-next-line func-names
serverConfigSchema.statics.getByGuildId = function (guildId, cb) {
	return this.findOne({ guildId: guildId });
};

// eslint-disable-next-line func-names
serverConfigSchema.statics.checkServerRolesAccessByGuildId = function (guildId, cb) {
	/* return new Promise(resolve => {
		verifyEntry(this, guildId)
			.then(entry => {
				const openRoles = [];
				if (!entry) resolve(openRoles);
				console.log('v============Roles are not here why?============v');
				console.log(entry.memberRoles.selfAssign);
				console.log('=================================================');
				console.log(entry.memberRoles.selfAssign.any);
				console.log('=================================================');
				console.log(entry.memberRoles.selfAssign.specific.map(el => el.roleId));
				if (entry.memberRoles.selfAssign.any.length > 0) openRoles.push('any');
				openRoles.concat(entry.memberRoles.selfAssign.specific.map(el => el.roleId));
				resolve(openRoles);
				console.log('^============Roles are not here why?============^');
			});
	});*/
	return this.findOne({ guildId: guildId });
};

// eslint-disable-next-line func-names
serverConfigSchema.statics.updateAccessibleRolesByGuildId = function (guildId, roles, cb) {
	/* return new Promise(resolve => {
		verifyEntry(this, guildId)
			.then(entry => {
				console.log('End my suffering');
				console.log(roles);
				// entry.memberRoles.selfAssign = roles;
				/* entry.save()
					.then(updatedEntry => {
						console.log('Updated ServerConfig');
						console.log(updatedEntry);
						resolve(updatedEntry, cb);
					});*/
	/* const query = this.updateOne({ guildId: guildId }, { $set: { 'memberRoles.selfAssign': roles } });
				console.log(query);
				console.log(query.get('memberRoles.selfAssign'));
				resolve();
			});
	});*/
	/*this.findOneAndUpdate({ guildId: guildId }, { $set: { 'memberRoles.selfAssign': roles } }, { upsert: true, new: true }, (err, updateDoc) => {
		console.log('I am really starting to get depressed over a fucking Mango?');
		if (err) console.error(err);
		console.log(updateDoc);
		console.log(updateDoc.memberRoles.selfAssign.any);
		console.log(updateDoc.memberRoles.selfAssign.specific);
		console.log('Christ almighty...');
	});*/

	return this.findOneAndUpdate({ guildId: guildId }, { $set: { 'memberRoles.selfAssign': roles } }, { upsert: true, new: true });
};

// eslint-disable-next-line func-names
serverConfigSchema.statics.updateMuteRole = function (guildId, muteRoleId) {
	return this.findOneAndUpdate({ guildId: guildId }, { $set: { 'admin.muteRole': muteRoleId } }, { upsert: true, new: true });
};

// eslint-disable-next-line func-names
serverConfigSchema.statics.getMuteRole = function (guildId) {
	return this.findOne({ guildId: guildId });
};

const ServerConfig = mongoose.model('serverconfig', serverConfigSchema, 'serverconfig');
module.exports = ServerConfig;
