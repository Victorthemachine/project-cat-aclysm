const { Permissions, Constants: { ChannelTypes } } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

/**
 * @extends {SlashCommandBuilder} SlachCommandBuilder discord.js
 */
module.exports = class SlashCommand extends SlashCommandBuilder {

	/**
	 *
	 * @param {Client} client
	 * @param {string} name
	 * @param {JSON} options
	 */
	constructor(client, name, options = {}) {
		super();
		// Needed params
		this.client = client;
		if (!name) throw new Error('You must supply name to a SlashCommand!');
		this.setName(name);
		if (!options.description) throw new Error('You must supply description to a SlashCommand!');
		this.setDescription(options.description);
		// Optional params, basically just for the help command tbh
		this.category = options.category || 'Miscellaneous';
		this.usage = `/${this.name} ${options.usage || ''}`.trim();
		this.userPerms = new Permissions(options.userPerms).freeze();
		this.botPerms = new Permissions(options.botPerms).freeze();
		this.ownerOnly = options.ownerOnly || false;
		this.nsfw = options.nsfw || false;
		this.channels = options.channels || [ChannelTypes.GUILD_TEXT, ChannelTypes.DM, ChannelTypes.GROUP_DM];
	}

	// eslint-disable-next-line no-unused-vars
	async execute(interaction, args) {
		throw new Error(`SlashCommand ${this.name} doesn't provide execute method!`);
	}

};
