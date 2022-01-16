const { Permissions, Constants: { ChannelTypes } } = require('discord.js');
const logger = require('../../structures/Logger');
const SlashCommand = require('../../structures/SlashCommand');

module.exports = class extends SlashCommand {

	constructor(...args) {
		super(...args, {
			description: 'Checks the ping of the bot',
			botPerms: [Permissions.FLAGS.SEND_MESSAGES],
			userPerms: [],
			usage: '',
			category: 'Utilities',
			ownerOnly: false,
			nsfw: false
		});

		this.setDefaultPermission(true);
	}

	async execute(interaction) {
		interaction.reply('Pinging...');
		interaction.fetchReply()
			.then(reply => {
				reply.edit(`My ping is ${reply.createdAt - interaction.createdAt}ms, API latency: ${this.client.ws.ping}ms`);
			})
			.catch(err => logger.info(err));
	}

};
