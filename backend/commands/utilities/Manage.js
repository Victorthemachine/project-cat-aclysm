const { nanoid } = require('nanoid');
const Command = require('../../structures/Command');
const Client = require('../../structures/schematics/Client');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['edit'],
			description: 'Sends you a link to access your profile and servers via web control panel.',
			category: 'Utilities',
			usage: '',
			ownerOnly: false
		});
	}

	async run(message, args) {
		const { author: { id } } = message;
		const duplicates = await Client.findByUserId(id);
		console.log(duplicates);
		if (duplicates.length > 0) {
			Client.deleteMany({ discord: { userId: id } });
		}
		const token = nanoid();
		Client.create({
			network: {
				uuid: token
			},
			discord: {
				userId: id,
				guildId: message.guild.id,
				// TODO: update this if I get a patreon to pay for this stuff lol
				supporter: false
			}
		});
		return message.author.send({ content: `Hi this is in early development \nHead to this link: http://localhost:8080/manager-panel/${token}` });
	}

};
