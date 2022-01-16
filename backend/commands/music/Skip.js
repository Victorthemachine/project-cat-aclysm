const Command = require('../../structures/Command');
const logger = require('./../../structures/Logger');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['skippy'],
			description: 'Skips one song, or the amount you determine!',
			category: 'Music',
			usage: '[amountOfSongsToSkip]',
			ownerOnly: false
		});
	}

	async run(message, args) {
		// Since I needn't do anything about the voice connection
		// as long as the channel id is in the map bot is connected
		if (this.client.musicUtils.fetchVoiceChannel(message.channel.id) && this.client.musicUtils.isMemberInVoice(message) === true) {
			logger.info(`How many tracks are in my queue: ${this.client.player.getQueue(message.guild.id).tracks.length}`);
			if (args.length === 0) {
				if (this.client.player.getQueue(message.guild.id).tracks.length > 0) {
					this.client.player.getQueue(message.guild.id).skip();
					return message.channel.send('Skipped that song for you <3!');
				} else {
					return message.channel.send('There is nothing to skip >~<!');
				}
			} else {
				const skipAmount = parseInt(args[0]);
				if (skipAmount < this.client.player.getQueue(message.guild.id).tracks.length) {
					this.client.player.getQueue(message.guild.id).skipTo(this.client.player.getQueue(message.guild.id).tracks[skipAmount - 1]);
					return message.channel.send(`Skipped ${skipAmount} of songs for you ^w^!`);
				} else {
					return message.channel.send('You cannot skip that many songs >~<!');
				}
			}
		}
	}

};
