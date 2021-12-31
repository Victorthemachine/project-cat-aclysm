const Event = require('../../structures/Event');
const logger = require('./../../structures/Logger');

module.exports = class extends Event {

    async run(oldVoiceState, newVoiceState) {
        logger.info('========================vVoiceStateUpdatev========================');
        const oldVoiceChannel = !oldVoiceState.channel ? null : await this.client.channels.fetch(oldVoiceState.channelId);
        const newVoiceChannel = !newVoiceState.channel ? null : await this.client.channels.fetch(newVoiceState.channelId);
        const wasInVoice = this.client.musicUtils.isBotInVoice(oldVoiceChannel);
        const isInVoice = this.client.musicUtils.isBotInVoice(newVoiceChannel);
        logger.info(`Is bot the target: ${oldVoiceState.id === this.client.user.id}`);
        logger.info(JSON.stringify(oldVoiceState))
        logger.info(JSON.stringify(newVoiceState))
        logger.info(wasInVoice);
        logger.info(isInVoice);

        //Do we care about the event?
        //If at least one is true, means bot is involved
        //AKA. music was or is playing
        if (wasInVoice === true || isInVoice === true) {
            if (wasInVoice === true && isInVoice === true) {
                //Bot didn't change, check members then
                const activeListeners = newVoiceChannel.members.filter(member => {
                    return this.client.musicUtils.isMemberActive(member);
                });
                if (activeListeners.size === 0) {
                    //TODO: Timeout option here
                    this.client.musicUtils.killConnection(newVoiceChannel, 'Nobody is listening, amma see myself out then... meanies');
                }
            }
            //No need to check if bot or member got connected
        }
        //if the old state had channel => there was connection
        //If bot isn't in voice but old state has it's id
        //Meaning bot got disconnected since otherwise
        if (oldVoiceChannel && isInVoice === false && oldVoiceState.id === this.client.user.id) {
                //Got disconnected
                this.client.musicUtils.wasDisconnected(oldVoiceChannel);
        }
        logger.info('========================^VoiceStateUpdate^========================');
    }

};