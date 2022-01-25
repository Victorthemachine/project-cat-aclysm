const { Permissions, Constants: { ChannelTypes } } = require('discord.js');
const SlashCommand = require('../../structures/SlashCommand');

module.exports = class extends SlashCommand {

	constructor(...args) {
		super(...args, {
			description: 'Allows you delete messages, purge channels and/or delete channels/categories',
			botPerms: [Permissions.FLAGS.MANAGE_MESSAGES, Permissions.FLAGS.MANAGE_CHANNELS],
			userPerms: [Permissions.FLAGS.MANAGE_MESSAGES, Permissions.FLAGS.MANAGE_CHANNELS],
			usage: '',
			category: '',
			ownerOnly: true,
			nsfw: false
		});

		this.setName('delete')
			.setDescription('Deletes messages, channels or categories. Can also purge')
			.setDefaultPermission(true)
			.addBooleanOption(option => option.setName('messages')
				.setDescription('True for deletion of messages, false for deletion/purging of channels')
				.setRequired(true))
			.addIntegerOption(option => option.setName('amount')
				.setDescription('Amount of messages you wish to delete')
				.setRequired(false)
				.setMinValue(1))
			.addMentionableOption(option => option.setName('target')
				.setDescription('If you supply a target, I will delete all messages that are not older than 14 days of user/role!')
				.setRequired(false))
			.addBooleanOption(option => option.setName('purge')
				.setDescription('Whether to purge channel/category. This will delete all of the messages')
				.setRequired(false))
			.addStringOption(option => option.setName('channel')
				.setDescription('Write name of the channel, or category of channels you want to delete/purge')
				.setRequired(false));
	}

	async execute(interaction, args) {
		// Goal is to have option to delete amount of messages, purge channels, or straight up delete categories
		if (args.messages === true) {
			// Running the message deletion script
			if (!args.amount && !args.target) return interaction.reply('You must supply either amount of messages to delete, or target');
			if (args.target) {

			} else {

			}
		} else {

		}
		return interaction.reply('Hello World');
	}

};
