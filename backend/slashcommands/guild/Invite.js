const { Permissions, Constants: { ChannelTypes } } = require('discord.js');
const SlashCommand = require('../../structures/SlashCommand');

module.exports = class extends SlashCommand {

    constructor(...args) {
        super(...args, {
            description: 'Tries to get you an invite to this guild ^^!',
            botPerms: [Permissions.FLAGS.CREATE_INSTANT_INVITE],
            userPerms: [],
            usage: '',
            category: 'Guild',
            ownerOnly: true,
            nsfw: false,
            channels: [ChannelTypes.GUILD_TEXT]
        });

        this.setDefaultPermission(true)
            .addIntegerOption(option => {
                return option.setName('timeout')
                    .setDescription('The amount of time before invite expires. You can define the time unit, default is hours')
                    .setMinValue(1)
                    .setRequired(false);
            })
            .addStringOption(option => {
                return option.setName('unit')
                    .setDescription('Time unit of your choosing (use: min, hr, day, week)')
                    .setRequired(false)
            })
            .addBooleanOption(option => {
                return option.setName('temporary')
                    .setDescription('If people receive temp role on join')
                    .setRequired(false);
            })
            .addIntegerOption(option => {
                return option.setName('uses')
                    .setDescription('How many uses before invite expires')
                    .setRequired(false);
            })
    }

    async execute(interaction, args) {
        // FIXME: Needs arguments to modify length etc.
        // TODO: Add modificitations based on guild setting, create inv, ask for inv, deny inv; (direct inv)
        if (interaction.memberPermissions.has(Permissions.FLAGS.ADMINISTRATOR) === true) {
            const invite = await interaction.guild.invites.create(interaction.channel, { maxAge: 0, maxUses: 0 });
            interaction.reply({
                content: `Sending you the invite into DMs >w<`,
                ephemeral: true
            });
            return interaction.member.user.send(`**Hello there ${interaction.member.nickname ? interaction.member.nickname : interaction.member.user.username}**\n\nHere's your invite ^^:\n${invite}`);
        }
        if (interaction.memberPermissions.has(Permissions.FLAGS.CREATE_INSTANT_INVITE, true) === true) {
            const invite = await interaction.guild.invites.create(interaction.channel, { maxUses: 5 });
            interaction.reply({
                content: `Sending you the invite into DMs >w<`,
                ephemeral: true
            });
            return interaction.member.user.send(`**Hello there ${interaction.member.nickname ? interaction.member.nickname : interaction.member.user.username}**\n\nHere's your invite ^^:\n${invite}`);
        } else {
            // TODO: message owners
        }
    }

};