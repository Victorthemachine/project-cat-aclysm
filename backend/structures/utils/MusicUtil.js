const { MessageEmbed } = require('discord.js');
const logger = require('../Logger');
const embedConfig = require('./../../configuration/embedConfig.json');

// Custom double way map
const TwoWayMap = require('./TwoWayMap');
const twoWayMap = new TwoWayMap();

module.exports = class MusicUtil {

	constructor(client) {
		this.client = client;
	}

	isBotInVoice(channel) {
		if (!channel) return false;
		if (channel.members.has(this.client.user.id) === false) {
			return false;
		} else if (channel.members.get(this.client.user.id).voice.mute === true) { return false; }
		return true;
	}

	isMemberInVoice({ member, guildId }) {
		if (!member.voice.channel) return false;
		if (member.voice.channel.guildId !== guildId) return false;
		return true;
	}

	isMemberActive(member) {
		if (member.voice.deaf === false && member.user.bot === false) return true;
		return false;
	}

	canConnect(channel) {
		return new Promise(resolve => {
			channel.guild.members.fetch(this.client.user).then(botMember => {
				resolve(channel.permissionsFor(botMember).has(['CONNECT', 'SPEAK']));
			});
		});
	}

	killConnection(channel, reason) {
		if (this.client.player.getQueue(channel.guildId)) {
			this.client.player.getQueue(channel.guildId).destroy(true);
		}
		this.client.guilds.cache.get(channel.guild.id).channels.cache.get(twoWayMap.get(channel.id)).send(reason);
		twoWayMap.deleteKey(channel.id);
	}

	registerChannel(voiceChannelId, commandChannelId) {
		twoWayMap.set(voiceChannelId, commandChannelId);
	}

	fetchVoiceChannel(commandChannelId) {
		logger.info('Keys in the two way map');
		return twoWayMap.fetch(commandChannelId);
	}

	/**
     * Hooks up to on disconnect event, and verifies
     * that the channel isn't empty, or that the bot
     * isn't muted etc.
     *
     * @param {VoiceChannel} voiceChannel
     */
	verifyConnection(channel) {

	}

	wasDisconnected(channel) {
		if (twoWayMap.get(channel.id)) {
			// Try catch, might have gotten kicked
			try {
				this.client.channels.fetch(twoWayMap.get(channel.id))
					.then(chann => {
						chann.send('Well that was rude! No need to boot me out like that >~<!');
					});
			} catch {
				logger.info(`Kicked out of ${channel.guild.name} during music playback`);
			}
			if (this.client.player.getQueue(channel.guildId)) {
				this.client.player.getQueue(channel.guildId).destroy();
			}
			twoWayMap.deleteKey(channel.id);
		}
	}

	setupSearchQueryEmbed({ member }, query, searchQuery) {
		let values = 'No results sorry';
		if (searchQuery.tracks.length > 0) {
			values = searchQuery.tracks.map((track, index) => {
				if (index < 10) {
					return `\`${index + 1}.\` ${track.title} - *${track.duration}*`;
				}
			});
		}

		const searchQueryEmbed = new MessageEmbed()
			.setColor(embedConfig.color)
			.setAuthor(member.displayName, member.displayAvatarURL())
			.setTitle(`Your search for "${query}", returned (drumroll please..) ${searchQuery.tracks.length} results`)
			.setThumbnail(this.client.user.displayAvatarURL())
			.setDescription('Select the song by reacting bellow (I will give you 15 seconds :P)')
			.addFields(
				{ name: 'I have found OwO:', value: values.join('\n').slice(0, 1023) }
			)
			.setFooter('Just so we are clear, you got 30 seconds or I am gonna forget :P. Sowwy I got bad memory >,<')
			.setTimestamp();
		return searchQueryEmbed;
	}

};
