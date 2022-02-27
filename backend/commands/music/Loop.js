const Command = require('../../structures/Command');
const logger = require('./../../structures/Logger');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [],
			description: '(Un)Loops the song!',
			category: 'Music',
			usage: '[LoopQueue=true|false]',
			ownerOnly: false
		});
	}

	async run(message, args) {
		// Since I needn't do anything about the voice connection
		// as long as the channel id is in the map bot is connected
		if (this.client.musicUtils.fetchVoiceChannel(message.channel.id) && this.client.musicUtils.isMemberInVoice(message) === true) {
			let queueLoop = false;
			let didLoop = false;
			if (args.length > 0) {
				if (args[0] === 'true') queueLoop = true;
			}
			if (queueLoop === true) {
				// Gotta appriciate the proper documentation of discord-player
				// so for everyone and me REPEAT MODE HAS VALUES:
				// OFF: 0, TRACK: 1, QUEUE: 2, AUTOPLAY: 3
				if (this.client.player.getQueue(message.guild.id).repeatMode === 2) {
					this.client.player.getQueue(message.guild.id).setRepeatMode(0);
				} else {
					didLoop = true;
					this.client.player.getQueue(message.guild.id).setRepeatMode(2);
				}
			} else if (this.client.player.getQueue(message.guild.id).repeatMode === 1) {
				this.client.player.getQueue(message.guild.id).setRepeatMode(0);
			} else {
				didLoop = true;
				this.client.player.getQueue(message.guild.id).setRepeatMode(1);
			}
			return message.channel.send({ content: `${didLoop === true ? 'L' : 'Unl'}ooped ${queueLoop === true ? 'queue' : 'track'} for you!` });
		}
	}

};
