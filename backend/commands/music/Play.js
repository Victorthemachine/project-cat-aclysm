const Command = require('../../structures/Command');
const logger = require('../../structures/Logger');

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
        /*if (args.length === 0) return message.channel.send('No link or search term supplied, you think I am some sort of clairvoyant >~<?');
        this.client.commands.get('join').run(message, args)
            .then((success) => {
                if (success === true) {
                    logger.debug(args[0]);
                    this.client.player.search(args[0], { "requestedBy": message.author })
                        .then(query => {
                            logger.debug(`Query had playlist: ${typeof query.playlist}`);
                            this.client.player.getQueue(message.guild.id).addTracks(query.tracks);
                            this.client.player.getQueue(message.guild.id).play();
                        })
                        .catch(err => {
                            logger.warn(err);
                        })
                } else return;
            })*/
        const voiceChannelId = this.client.musicUtils.fetchVoiceChannel(message.channel);
        if (!voiceChannelId) {
            await this.client.commands.get('join').run(message, args);
        }
        if (args.length === 0) {
            return message.channel.send('You need to gimme a link or search term for me to look up >~<!');
        }
        const searchTerm = args.length === 1 ? args[0] : args.join(' ');
        if (searchTerm.includes('http')) {
            this.client.player.search(searchTerm, { requestedBy: message.author })
                .then(query => {
                    logger.debug(`Query had playlist: ${typeof query.playlist}`);
                    if (query.tracks.length > 1) {
                        (this.client.player.getQueue(message.guildId)).addTracks(query.tracks);
                    } else {
                        (this.client.player.getQueue(message.guildId)).addTrack(query.tracks[0]);
                    }
                    this.client.player.getQueue(message.guild).play();
                })
                .catch(err => {
                    logger.warn(err);
                    message.channel.send('Sorry something went wrong with that song QwQ. Wanna try different one ^w^?')
                })
        } else {
            logger.info(searchTerm);
            this.client.player.search(searchTerm.trim(), { requestedBy: message.author })
                .then(query => {
                    message.channel.send({ embeds: [this.client.musicUtils.setupSearchQueryEmbed(message, searchTerm, query)] });
                })
                .catch(err => {
                    logger.warn(err);
                    message.channel.send('Sorry something went wrong with that song QwQ. Wanna try different one ^w^?')
                })
        }
    }

};