const { Permissions, Constants: { ChannelTypes } } = require('discord.js');
const SlashCommand = require('../../structures/SlashCommand');
const { milis } = require('./../../configuration/botConstants');
const Member = require('../../structures/schematics/Member');
const ServerConfig = require('../../structures/schematics/ServerConfig');
const logger = require('../../structures/Logger');

module.exports = class extends SlashCommand {

	constructor(...args) {
		super(...args, {
			description: 'Mutes target member',
			botPerms: [Permissions.FLAGS.MANAGE_ROLES],
			// TODO: yeah i think it's fair that not every user needs this perm to mute, make override
			userPerms: [Permissions.FLAGS.MANAGE_ROLES],
			usage: 'wip',
			category: 'Admin',
			ownerOnly: true,
			nsfw: false,
			channels: [ChannelTypes.GUILD_TEXT]
		});

		this.setDefaultPermission(true)
			.addMentionableOption(option => option.setName('target')
				.setDescription('Person you wish to mute')
				.setRequired(true))
			.addIntegerOption(option => option.setName('timeout')
				.setDescription('For how long to mute them')
				.setRequired(false))
			.addStringOption(option => option.setName('unit')
				.setDescription('Time unit of your choosing (use: min, hr, day, week)')
				.setRequired(false));
	}

	async execute(interaction, args) {
		// TODO: possible good idea is to make the mute role sorta resemble top role, but just block typing
		interaction.deferReply()
			.then(async () => {
				const muteMember = await interaction.guild.members.fetch(args.target.id);
				const serverConfigDoc = await ServerConfig.getMuteRole(interaction.guildId);
				let muteRole;
				if (!serverConfigDoc || !serverConfigDoc.admin || !serverConfigDoc.admin.muteRole) {
					muteRole = await interaction.guild.roles.create({
						name: 'Muted',
						hoist: true,
						permission: new Permissions().freeze(),
						mentionable: false,
						reason: 'There was no mute role for Nya~bot'
					});
					await ServerConfig.updateMuteRole(interaction.guildId, muteRole.id);
				} else {
					muteRole = interaction.guild.roles.cache.get(serverConfigDoc.admin.muteRole);
				}
				console.log('Broski let me fucking sleep');
				console.log(muteRole);
				if (muteMember.roles.cache.has(muteRole.id) === false) {
					Member.updateRoleForGuildId(muteMember.id, interaction.guildId, muteMember.roles.cache.map(el => el.id), (newDoc) => {
						console.log('========Here we go========');
						console.log(newDoc);
						muteMember.roles.set([muteRole.id])
							.then(newMember => {
								// TODO: add file to remember that it's supposed to unmute
                                const timeoutInMilis = args.timeout ? milis.isTimeUnit(args.unit) ? milis.toMilis(args.timeout, args.unit) : milis.toMilis(args.timeout, 'hour') : 0;
                                console.log(timeoutInMilis);
								if (timeoutInMilis !== 0) {
									// FIXME: this seems sketchy at best, deal with this some other way
									// eslint-disable-next-line func-names
                                    setTimeout(function () {
                                        console.log('It\'s about time');
										const guild = this.client.guilds.cache.get(interaction.guildId);
										if (guild) {
											const member = guild.members.cache.get(newMember.id);
											if (member) {
												member.roles.set(newDoc.roles.find(el => el.guildId).roles.filter(el => guild.roles.cache.has(el) === true))
													.then(itDoes => {
														console.log('It\'s finally over');
													});
											}
										}
									}.bind(this, interaction, newMember, muteRole, newDoc), timeoutInMilis);
								}
								return interaction.editReply(`Muted ${newMember.displayName}`);
							})
							.catch(err => {
								logger.error(err);
								return interaction.editReply('Um, perhaps I am missing permissions, or the said person is above me. But I failed to mute them >.<');
							});
					});
				} else {
					Member.getByMemberId(muteMember.id)
						.then(newDoc => {
							muteMember.roles.set(newDoc.roles.find(el => el.guildId === interaction.guildId).roles.filter(el => interaction.guild.roles.cache.has(el) === true))
								.then(newMember => {
									console.log('FUCK MY LIFE');
									return interaction.editReply(`Unmuted ${newMember.displayName}`);
								});
						});
				}
			});
	}

};
