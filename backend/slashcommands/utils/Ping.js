const { Permissions } = require('discord.js');
const SlashCommand = require('../../structures/SlashCommand');

module.exports = class extends SlashCommand {
    constructor(...args) {
        super(...args, {
            description: 'Replies back at you!',
            category: 'Utils',
            botPerms: [Permissions.FLAGS.SEND_MESSAGES],
            nsfw: false,
        })
        this.setDefaultPermission(true);
    }

    async execute(interaction) {
        return interaction.reply('pong');
    }

}