const { Permissions } = require('discord.js');
const SlashCommand = require('../structures/SlashCommand');

module.exports = class extends SlashCommand {
    constructor(...args) {
        super(...args, {
            description: 'Multiplies two numbers',
            botPerms: [Permissions.FLAGS.SEND_MESSAGES],
            nsfw: false,
        })
        this.setDefaultPermission(true);
        this.addIntegerOption(option =>
            option.setName('num1')
                .setRequired(true)
                .setDescription('First number')
        )
        this.addIntegerOption(option =>
            option.setName('num2')
                .setRequired(true)
                .setDescription('Second number')
        )
        this.addStringOption(option =>
            option.setName('thanks')
                .setRequired(false)
                .setDescription('Thank the bot!')
        )
    }

    async execute(interaction) {
        return interaction.reply('TBD');
    }

}