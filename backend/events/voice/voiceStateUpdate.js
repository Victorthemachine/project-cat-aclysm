const Event = require('../../structures/Event');
const logger = require('./../../structures/Logger');

module.exports = class extends Event {

    async run(oldVoiceState, newVoiceState) {
        const wasInVoice = this.client.musicUtils.isBotInVoice(oldVoiceState.channel);
        const isInVoice = this.client.musicUtils.isBotInVoice(newVoiceState.channel);
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
                const activeListeners = newVoiceState.channel.members.filter(member => {
                    return this.client.musicUtils.isMemberActive(member);
                });
                if (activeListeners.size === 0) {
                    //TODO: Timeout option here
                    this.client.musicUtils.killConnection(newVoiceState, 'Nobody is listening, amma see myself out then... meanies');
                }
            }

            if (wasInVoice === true && isInVoice === false) {
                //Got disconnected
                this.client.musicUtils.wasDisconnected(newVoiceState);
            }

            //No need to check if bot or member got connected
        }
    }

};