const { Permissions, Constants: { ChannelTypes } } = require('discord.js');
const SlashCommand = require('../../structures/SlashCommand');

module.exports = class extends SlashCommand {

	constructor(...args) {
		super(...args, {
			description: 'Bans target member',
			botPerms: [Permissions.FLAGS.BAN_MEMBERS],
			userPerms: [Permissions.FLAGS.BAN_MEMBERS],
			usage: 'wip',
			category: 'Admin',
			ownerOnly: true,
			nsfw: false,
			channels: [ChannelTypes.GUILD_TEXT]
		});

		this.setDefaultPermission(true);
		this.setDefaultPermission(true)
			.addMentionableOption(option => option.setName('target')
				.setDescription('Person you wish to mute')
				.setRequired(true))
			.addStringOption(option => option.setName('reason')
				.setDescription('Reason for banning the person')
				.setRequired(false))
			.addIntegerOption(option => option.setName('days')
				.setDescription('How many days of messages to del (0-7)')
				.setMinValue(0)
				.setMaxValue(7)
				.setRequired(false));
	}

	async execute(interaction, args) {
		interaction.deferReply()
			.then(async succ => {
				const member = await interaction.guild.members.fetch(args.target.id);
				if (!member) return interaction.editReply(`Member ${args.target} does not exist >~<!`);
				if (args.reason) {
					member.send({ content: `You were banned from ${interaction.guild.name} for: ${args.reason}` })
						.then(succ => {
							//console.log('Reason sent!');
						})
						.catch(err => {
							//console.log('Yikes');
						});
				}
				const banObj = () => {
					const temp = {};
					if (args.days) temp.days = args.days;
					if (args.reason) temp.reason = args.reason;
					return temp;
				};
				member.ban(banObj());
				return interaction.editReply(`Banned ${member.displayName}${args.reason ? ` for ${args.reason}` : ''}`);
			});
	}

};
