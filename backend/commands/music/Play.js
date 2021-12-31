const Command = require('../../structures/Command');
const logger = require('../../structures/Logger');
const reactionsConfig = require('./../../configuration/reactions.json');
const { numbers } = reactionsConfig;

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            aliases: ['add'],
            description: 'If I am not in the voice channel, I join and play what you ask of me! I can also add that song to queue! Or just search your term ^^!',
            category: 'Music',
            usage: '<link|searchTerm>',
            ownerOnly: false
        });
    }

    //Heya mega poggers thing right here
    //Sooo basically the player options are broken in the depo
    //that means it has the defaults which can break the bot :)
    //Isn't that fun? And no I refusu to try catch every goddamn thing
    async run(message, args) {
        logger.info('========================vPlay.jsv========================');
        logger.info(message.channel.id);
        const voiceChannelId = this.client.musicUtils.fetchVoiceChannel(message.channel.id);
        logger.info('Is there a channel?');
        logger.info(voiceChannelId);
        if (!voiceChannelId) {
            await this.client.commands.get('join').run(message, args);
            //add fallback if member isn't in voice
        }
        if (args.length === 0) {
            return message.channel.send('You need to gimme a link or search term for me to look up >~<!');
        }
        const searchTerm = args.length === 1 ? args[0] : args.join(' ');
        let isPlaying;
        try {
            if (this.client.player.getQueue(message.guild).connection.paused === false) {
                isPlaying = true;
            } else {
                isPlaying = false;
            }
        } catch {
            isPlaying = false;
        }
        if (searchTerm.includes('http')) {
            this.client.player.search(searchTerm, { requestedBy: message.author })
                .then(query => {
                    logger.debug(`Query had playlist: ${typeof query.playlist}`);
                    if (query.tracks.length > 1) {
                        (this.client.player.getQueue(message.guildId)).addTracks(query.tracks);
                    } else {
                        (this.client.player.getQueue(message.guildId)).addTrack(query.tracks[0]);
                    }
                    if (isPlaying === false) {
                        this.client.player.getQueue(message.guild).play();
                    }
                })
                .catch(err => {
                    logger.warn(err);
                    message.channel.send('Sorry something went wrong with that song QwQ. Wanna try different one ^w^?')
                })
        } else {
            logger.info(searchTerm);
            this.client.player.search(searchTerm.trim(), { requestedBy: message.author })
                .then(query => {
                    message.channel.send({ embeds: [this.client.musicUtils.setupSearchQueryEmbed(message, searchTerm, query)] })
                        .then(sentMessage => {
                            let didItFail = false;
                            volatileLoop:
                            for (let el of numbers.string) {
                                if (didItFail === true) break volatileLoop;
                                sentMessage.react(el)
                                    .then(() => {
                                        logger.info('Yay it reacted and it didn\'t crash my app');
                                    })
                                    .catch(err => {
                                        logger.warn('Oh no it reacted and message wasn\'t there what a tragedy, now for love of god don\'t crash the fucking app');
                                        didItFail = true;
                                    });
                            }
                            const filter = (reaction, user) => {
                                return numbers.string.includes(reaction.emoji.name) && user.id === message.author.id;
                            };
                            let index;
                            const collector = sentMessage.createReactionCollector({ filter, time: 30000 })
                            collector.on('collect', (reaction, user) => {
                                //Possibly could be optimized by just using a map? And swapping over the values
                                //But I am too tired rn to figure it out
                                logger.info('reaction collector');
                                logger.info(reaction.emoji.name);
                                logger.info((Object.keys(numbers).find(key => numbers[key] === reaction.emoji.name)));
                                index = parseInt((Object.keys(numbers).find(key => numbers[key] === reaction.emoji.name))) - 1;
                                collector.stop()
                            })
                            collector.on('end', (collected, reason) => {
                                logger.info('Reason for collector ending');
                                logger.info(reason);
                                logger.info(index);
                                sentMessage.delete()
                                    .then(() => {
                                        logger.info('Succesful delete msg');
                                    })
                                    .catch(err => {
                                        logger.warn('Failed delete msg');
                                    });
                                if (reason !== 'time') {
                                    if (index !== -1) {
                                        this.client.player.getQueue(message.guild).addTrack(query.tracks[index]);
                                        if (isPlaying === false) {
                                            this.client.player.getQueue(message.guild).play();
                                        }
                                    }
                                } else {
                                    message.channel.send(`Yea you didnt react yatatata`);
                                }
                            })
                        });
                })
                .catch(err => {
                    logger.warn(err);
                    message.channel.send('Sorry something went wrong with that song QwQ. Wanna try different one ^w^?');
                });
        }
        logger.info('========================^Play.js^========================');
    }

};