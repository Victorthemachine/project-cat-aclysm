const { Permissions, Constants: { ChannelTypes } } = require('discord.js');
const SlashCommand = require('../../structures/SlashCommand');
const { milis } = require('./../../configuration/botConstants');

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
			.addIntegerOption(option => option.setName('timeout')
				.setDescription('The amount of time before invite expires. You can define the time unit, default is hours')
				.setMinValue(1)
				.setRequired(false))
			.addStringOption(option => option.setName('unit')
				.setDescription('Time unit of your choosing (use: min, hr, day, week)')
				.setRequired(false))
			.addBooleanOption(option => option.setName('temporary')
				.setDescription('If people need to receive role within 24hrs of join')
				.setRequired(false))
			.addIntegerOption(option => option.setName('uses')
				.setDescription('How many uses before invite expires')
				.setRequired(false));
	}

	async execute(interaction, args) {
		// Init defaults/user selects
		// Maybe make guild set default fallbacks? Although I don't really see the point
		console.log(args.timeout);
		let maxAge = args.timeout ? milis.isTimeUnit(args.unit) ? milis.toMilis(args.timeout, args.unit) : milis.toMilis(args.timeout, 'hour') : 0;
		if (maxAge > milis.milisTime.week) maxAge = milis.milisTime.week;
		// FIXME: Discords invite is in seconds? Hadn't seen that in docs -w-. Fix that please later
		maxAge /= 1000;
		const maxUses = args.uses ? args.uses : 0;
		const temporary = args.temporary ? args.temporary : false;

		if (interaction.memberPermissions.has(Permissions.FLAGS.ADMINISTRATOR) === true) {
			const invite = await interaction.guild.invites.create(interaction.channel, { maxAge: maxAge, maxUses: maxUses, temporary: temporary });
			interaction.reply({
				content: `Sending you the invite into DMs >w<`,
				ephemeral: true
			});
			return interaction.member.user.send(`**Hello there ${interaction.member.nickname ? interaction.member.nickname : interaction.member.user.username}**\n\nHere's your invite ^^:\n${invite}`);
		}
		if (interaction.memberPermissions.has(Permissions.FLAGS.CREATE_INSTANT_INVITE, true) === true) {
			const invite = await interaction.guild.invites.create(interaction.channel, { maxAge: maxAge, maxUses: maxUses, temporary: temporary });
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
