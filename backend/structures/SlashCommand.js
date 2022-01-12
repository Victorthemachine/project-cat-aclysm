const { Permissions } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = class SlashCommand extends SlashCommandBuilder {

  constructor(client, name, options = {}) {
    super();
    //Needed params
    this.client = client;
    if (!name) throw new Error('You must supply name to a SlashCommand!');
    this.setName(name);
    if (!options.description) throw new Error('You must supply description to a SlashCommand!');
    this.setDescription(options.description);
    //Optional params, basically just for the help command tbh
    this.category = options.category || 'Miscellaneous';
    this.usage = `/${this.name} ${options.usage || ''}`.trim();
    this.userPerms = new Permissions(options.userPerms).freeze();
    this.botPerms = new Permissions(options.botPerms).freeze();
    this.ownerOnly = options.ownerOnly || false;
    this.nsfw = options.nsfw || false;
  }

  async execute(interaction, args) {
    throw new Error(`SlashCommand ${this.name} doesn't provide execute method!`);
  }
}