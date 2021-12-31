const Command = require('../../structures/Command');
const logger = require('./../../structures/Logger')

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            aliases: ['leave'],
            description: 'Disconnects from the voice channel and clears the queue.',
            category: 'Music',
            usage: '',
            ownerOnly: false
        });
    }

    async run(message, args) {
        const targetVoiceChannel = this.client.guilds.cache.get(message.guild.id).channels.cache.get(this.client.musicUtils.fetchVoiceChannel(message.channel.id));
        if (this.client.musicUtils.isMemberInVoice(message) === true && this.client.musicUtils.isBotInVoice(targetVoiceChannel) === true) {
            try {
                this.client.musicUtils.killConnection(targetVoiceChannel, 'Alright, see ya later!')
                this.client.player.getQueue(message.guild.id).destroy();
                return;
            } catch (error) {
                logger.error(error);
                return message.channel.send(`Something went wrong, I can't disconnect properly???!`);
            }
        } else {
            return message.channel.send(`Buddy you need to be in a voice channel >~<!`);
        }
    }

};