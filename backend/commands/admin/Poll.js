const Command = require('../../structures/Command');
module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['survey', 'ask'],
			description: 'Creates a poll for your server, there are several options availible for you ^w^. It\'s better in the online panel though :3!',
			category: 'Admin',
			usage: '',
			ownerOnly: false
		});
	}

	async run(message, args) {
	}

};
