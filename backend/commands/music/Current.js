const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/Command');
const embedConfig = require('./../../configuration/embedConfig.json');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['nowplaying', 'playing'],
			description: 'Description of currently playing song',
			category: 'Music',
			usage: '',
			ownerOnly: false
		});
	}

	async run(message, args) {
		if (this.client.musicUtils.fetchVoiceChannel(message.channel.id) && this.client.musicUtils.isMemberInVoice(message) === true) {
			const track = this.client.player.getQueue(message.guild.id).nowPlaying();
			if (track) {
				const embed = new MessageEmbed()
					.setColor(embedConfig.color)
					.setAuthor(message.member.displayName, message.member.displayAvatarURL())
					.setTitle(`Currently playing: ${track.author} - ${track.title}`)
					.setDescription('That\'s the brief description. If you want lyrics use, bat!lyrics <Song name>!')
					.setThumbnail(track.thumbnail)
					.addFields(
						{ name: 'Current progress', value: this.client.player.getQueue(message.guild.id).createProgressBar({ timecodes: true }) },
						{ name: 'Link to media', value: track.url }
					)
					.setFooter('Enjoying mah sweet tunes :P?')
					.setTimestamp();
				message.channel.send({ embeds: [embed] });
			} else {
				return message.channel.send('Um nothing is playing? What should I display O.o?');
			}
		}
	}

};
