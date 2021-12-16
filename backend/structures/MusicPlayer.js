const { Player } = require('discord-player');
const logger = require('./Logger');

module.exports = class MusicPlayer extends Player {
    constructor(client, options = {}) {
        //Add option to disable youtube once I understand legal ramifications
        if (!client) {
            throw new Error('Player requires bot client to initialize')
        } else {
            const player = new Player(client, {
                "leaveOnEmpty": "true",
                "leaveOnStop": "false",
                "leaveOnEmptyCooldown": "5000",
                "autoSelfDeaf": "true",
            });
            this.#initEvents(player);
            this.playerInstance = player;
        }
    }

    /**
     * TODO: check with settings
     * @param {Player} player 
     */
    #initEvents(player) {
        player.on('connectionCreate', (queue, audioChannel) => queue.metadata.channel.send(`Hello there ${audioChannel.channel.name}, let\' jam!`))
        player.on('connectionError', (queue, error) => {
            logger.error(`[${queue.guild.name}] ${error.message}`);
            queue.metadata.channel.send(`I can\'t join the channel QwQ! Check my permissions please.`)
        });
        player.on('debug', (queue, message) => {
            logger.debug(`[${queue.guild.name}] ${message}`)
        });
        player.on('error', (queue, error) => {
            logger.crit(`[${queue.guild.name}] ${error.message}`);
        })
        player.on('trackAdd', (queue, track) => queue.metadata.channel.send(`Added ${track.title} to the queue!`));
        player.on('tracksAdd', (queue, tracks) => queue.metadata.channel.send(`Added ${tracks.length} songs to the queue!`));
        player.on('trackStart', (queue, track) => queue.metadata.channel.send(`Now playing - ${track.title}!`));
        player.on('queueEnd', (queue) => queue.metadata.channel.send(`That's it, queue is empty... unless you got some more music OwO?`));
        player.on('botDisconnect', (queue) => queue.metadata.channel.send(`Bye bye for now friends >w<!`));
        player.on('channelEmpty', (queue) => {
            queue.metadata.channel.send(`Oh I am all alone here in ${queue.connection.channel.name} QwQ. Guess I'll see myself out... mean...`);
        });
    }
}