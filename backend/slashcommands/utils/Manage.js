const { Permissions, Constants: { ChannelTypes } } = require('discord.js');
const logger = require('../../structures/Logger');
const SlashCommand = require('../../structures/SlashCommand');

module.exports = class extends SlashCommand {

	constructor(...args) {
		super(...args, {
			description: 'Manage your profile and/or servers, roles etc.',
			usage: '',
			category: 'Utils',
			ownerOnly: true,
			nsfw: false,
			channels: [ChannelTypes.DM, ChannelTypes.GUILD_TEXT]
		});

		this.setDefaultPermission(true);
	}

	async execute(interaction, args) {
		const authOptions = await this.client.serverUtils.createAuthOption(interaction.user.id);
		// TODO: make this an embed and make the link use config
		// eslint-disable-next-line max-len
		const messageContent = `Here are your authentification options.\n\n1. Open this link, it will automatically authentificate you.\n2. Enter this PIN in the authentification step\n\nLink:||http://localhost:3000/login/${authOptions.url}||\nPIN: ||${authOptions.pin}||`;
		interaction.user.send({ content: messageContent })
			.then(msg => {
				interaction.reply({ ephemeral: true, content: 'Sent you your authentification information to your DM!' });
			})
			.catch(err => {
				logger.info(err);
				interaction.reply({ ephemeral: true, content: 'Cannot send your authentification information to your DM. Enable DMs with this bot, it is being sent to DM for security reasons.' });
			});
	}

};
