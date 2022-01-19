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

        this.setDefaultPermission(true);
        this.addSubcommand(cmd => {
            cmd.addIntegerOption(option => {
                option.setMinValue(1);
                option.setRequired(true);
                option.setName('Timeout');
                option.setDescription('The amount of time before invite expires');
            });
            cmd.addStringOption(option => {
                option.setRequired(true);
                option.setName('Unit');
                option.setDescription('Time unit of your choosing');
                option.addChoices(['min', 'hr', 'day']);
            })
            cmd.setDescription('Defines max age of an invite')
            cmd.setName('MaxAge')
        })
        this.addBooleanOption(option => {
            option.setName('Temporary');
            option.setDescription('If people receive temp role on join');
            option.setRequired(false);
        })
        this.addIntegerOption(option => {
            option.setName('Uses');
            option.setDescription('How many uses before invite expires');
            option.setRequired(false);
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