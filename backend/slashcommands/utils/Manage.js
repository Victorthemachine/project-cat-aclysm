const { Permissions, Constants: { ChannelTypes } } = require('discord.js');
const SlashCommand = require('../structures/SlashCommand');

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
        return interaction.reply('Hello World');
    }

};