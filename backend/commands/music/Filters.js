const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const embedConfig = require('./../../configuration/embedConfig.json');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['filter'],
			description: 'Use without any arguments to see availible filters! Use filter name or corresponding number to enable/disable filter ^^',
			category: 'Music',
			usage: '[filter|numberOfFilter],[anotherFilter|anotherNumberOfFilter]',
			ownerOnly: false
		});
	}

	/**
     * Fuck it I am so pissed about these filters amma do it myself, AGAIN. Yay.
     * @param {*} message
     * @param {*} args
     * @returns
     */
	async run(message, args) {
		if (args.length === 0) {
			// I hate this depo so much, you literally cannot display filters unless you have queue built. What the fuck honestly
			const embed = new MessageEmbed()
				.setColor(embedConfig.color)
				.setAuthor(message.member.displayName, message.member.displayAvatarURL())
				.setTitle(`Availible filters for ${message.guild.name}`)
				.setDescription('All the filters should work, however these are developed independently from the bot so I can\'t quarantee how well they work >,<')
				.setThumbnail(this.client.user.displayAvatarURL())
				.addFields(
					// Now this should be just simple array.concat(activefilters, inactivefilters) but nah  I can't access the goddamn filters
					{ name: 'Filter', value: ['bassboost', 'bassboost+', 'bassboost++', 'vaporwave', 'nightcore', 'phaser', 'vibrato', 'reverse', 'treble', 'normalizer'], inline: true },
					{ name: 'Description (if needed)', value: ['Boosts the bass', 'Boosts the bass a fair bit', 'Boosts the bass a LOT :P'], inline: true }
				)
				.setFooter('Enjoying mah sweet tunes :P?')
				.setTimestamp();
		} else if (this.client.musicUtils.fetchVoiceChannel(message.channel.id) && this.client.musicUtils.isMemberInVoice(message) === true) {

		} else {
			return message.channel.send('Sorry, but you can\'t go changing filters if aren\'t jamming together >.<');
		}
	}

};
