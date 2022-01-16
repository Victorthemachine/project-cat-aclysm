const { Constants: { ChannelTypes } } = require('discord.js');
const Event = require('../structures/Event');
const { extractSlashCommandOptions } = require('./../structures/utils/InteractionExtractor');

module.exports = class extends Event {

	async run(interaction) {
		// console.log(extractSlashCommandOptions(interaction));
		if (interaction.isCommand() === true) {
			const slashCommand = this.client.slashCommands.get(interaction.commandName);
			// Verify permissions, channels, owner, maybe guild specific role perms?
			console.log(slashCommand.channels);
			console.log(ChannelTypes[interaction.channel.type]);
			if (slashCommand.channels.includes(ChannelTypes[interaction.channel.type]) === false) {
				return interaction.reply({
					content: `Sorry but this command can't be used in ${this.client.utils.formatChannelTypes(slashCommand.channels)} >~<!`,
					ephemeral: true
				});
			}

			if (slashCommand.owner === true && this.client.utils.checkOwner(interaction.user.id) === false) {
				return interaction.reply({
					content: 'Sorry but this command can only be used by the owners',
					ephemeral: true
				});
			}

			// NOTE: Perhaps add an role/perms that override even the admin perm if guild set like that?
			if (interaction.inGuild()) {
				let missingPerms = interaction.memberPermissions.missing(slashCommand.userPerms, true);
				if (missingPerms.length) {
					return interaction.reply({
						content: `Sorry but you are missing ${this.client.utils.formatArray(missingPerms.map(this.client.utils.formatPerms))} permission${missingPerms.length > 1 ? 's' : ''}`,
						ephemeral: true
					});
				}
				missingPerms = interaction.channel.permissionsFor(this.client.guilds.cache.get(interaction.guildId).members.cache.get(this.client.user.id)).missing(slashCommand.botPerms, true);
				if (missingPerms.length) {
					return interaction.reply({
						content: `Sorry but I'm missing ${this.client.utils.formatArray(missingPerms.map(this.client.utils.formatPerms))} permission${missingPerms.length > 1 ? 's' : ''}`,
						ephemeral: true
					});
				}
			}
			// TODO: add role specific settings through mongo
			return slashCommand.execute(interaction, extractSlashCommandOptions(interaction));
		}

		// [x]: add other interaction stuff here:
	}

};
