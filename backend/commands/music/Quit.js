const Command = require('../../structures/Command');
const logger = require('./../../structures/Logger')

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            aliases: ['leave'],
            description: '',
            category: '',
            usage: '',
            ownerOnly: false
        });
    }

    async run(message, args) {
        if (message.member && message.member.voice.channel) { //fix to check for bot
            try {
                this.client.player.getQueue(message.guild.id).destroy();
                return message.channel.send(`Later gator`);
            } catch (error) {
                logger.error(error);
                return message.channel.send(`Something went wrong, I can't join your voice channel!`);
            }
        } else {
            return message.channel.send(`Buddy you need to be in a voice channel >~<!`);
        }
    }

};