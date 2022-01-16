const Command = require('../../structures/Command');
const logger = require('./../../structures/Logger');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [],
			description: 'Joins your voice channel!',
			category: 'Music',
			usage: '',
			ownerOnly: false
		});
	}

	async run(message, args) {
		/* if (message.member && message.member.voice.channel) {
            try {
                const queue = await this.client.player.createQueue(message.guild, {
                    metadata: {
                        channel: message.channel
                    },
                    PlayerOptions: {
                        "leaveOnStop": "false",
                        "autoSelfDeaf": "true",
                    }
                });
                queue.connect(message.member.voice.channelId);
                return true;
            } catch (error) {
                logger.error(error);
                return message.channel.send(`Something went wrong, I can't join your voice channel!`);
            }
        } else {
            return message.channel.send(`Buddy you need to be in a voice channel >~<!`);
        }*/
		if (this.client.musicUtils.isMemberInVoice(message) === true) {
			if (await this.client.musicUtils.canConnect(message.member.voice.channel) === true) {
				try {
					this.client.player.createQueue(message.guild, {
						metadata: {
							channel: message.channel
						},
						PlayerOptions: {
							leaveOnStop: 'false',
							autoSelfDeaf: 'true'
						}
					}).connect(message.member.voice.channel);
					logger.info('Connected to voice');
					logger.info(`${message.member.voice.channelId} ${message.channelId}`);
					this.client.musicUtils.registerChannel(message.member.voice.channelId, message.channelId);
					return;
				} catch (error) {
					logger.error(error);
					return message.channel.send(`Something went wrong, contact Nya~san#6539. Sorry for the inconvience >.<`);
				}
			} else {
				return message.channel.send(`Sorry I am missing permissions to join/talk channel "${message.member.voice.channel.name}"`);
			}
		} else {
			return message.channel.send('You need to be in voice channel dummy >,>!');
		}
	}

};
