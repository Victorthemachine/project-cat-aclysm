const Event = require('../../structures/Event');
const Member = require('../../structures/schematics/Member');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			once: false
		});
	}

	async run(member) {
		// Possibly create timeout in mongo so that it deletes it after I dunno month?
		// TODO: Banner and fixup mongo stuff here
		if (member.roles.cache.size > 0) {
			Member.updateRoleForGuildId(member.id, member.guild.id, member.roles.cache.map(el => el.id), callback => {
				// console.log('You are cool ya know');
			});
		}

		// Member left server banner?
	}

};

