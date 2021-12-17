const Command = require('../../structures/Command');
const logger = require('./../../structures/Logger')

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            aliases: [''],
            description: '',
            category: '',
            usage: '',
            ownerOnly: false
        });
    }

    async run(message, args) {
        if (message.member && message.member.voice.channel) {
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
            } catch (error) {
                logger.error(error);
                message.channel.send(`Something went wrong, I can't join your voice channel!`);
            }
        } else {
            return message.channel.send(`Buddy you need to be in a voice channel >~<!`);
        }
    }

};