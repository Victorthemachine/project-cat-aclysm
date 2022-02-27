const Command = require('../../structures/Command');
const logger = require('./../../structures/Logger');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['unpause'],
			description: '(Un)Pauses the queue!',
			category: 'Music',
			usage: '',
			ownerOnly: false
		});
	}

	async run(message, args) {
		// Since I needn't do anything about the voice connection
		// as long as the channel id is in the map bot is connected
		if (this.client.musicUtils.fetchVoiceChannel(message.channel.id) && this.client.musicUtils.isMemberInVoice(message) === true) {
			const isPaused = this.client.player.getQueue(message.guild.id).connection.paused;
			this.client.player.getQueue(message.guild.id).setPaused(isPaused !== true);
			message.channel.send(`${isPaused === true ? 'Unpaused' : 'Paused'} the queue for you!`);
		}
	}

};
