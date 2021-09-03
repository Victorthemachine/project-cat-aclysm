const { Client, Collection, Permissions, MessageEmbed, Intents } = require('discord.js');
const Util = require('./Util.js');
const Server = require('./Server');
const Database = require('./Database');
const { Player } = require('discord-player');

module.exports = class NyaBotClient extends Client {

    constructor(options = {}) {
        super({
            allowedMentions: {
                parse: ['users', 'roles'],
                repliedUser: true
            },
            intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_WEBHOOKS, Intents.FLAGS.GUILD_INVITES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MESSAGE_TYPING, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGE_TYPING]
        });
        this.validate(options);

        this.commands = new Collection();

        this.aliases = new Collection();

        this.events = new Collection();

        this.pollObjects = new Collection();

        this.utils = new Util(this);

        this.owners = options.owners;

        this.server = new Server(this);

        new Database().isConnected()
            .then(res => {
                this.connection = res;
            })
            .catch(err => {
                console.error(err);
            });

        //Rework the entire music structure this is kinda a mess
        this.player = new Player(this, { leaveOnEmptyCooldown: 30, leaveOnStop: false, leaveOnEmpty: true });
        this.initPlayerEvents();
    }

    validate(options) {
        if (typeof options !== 'object') throw new TypeError('Options should be a type of Object.');

        if (!options.token) throw new Error('You must pass the token for the client.');
        this.token = options.token;

        if (!options.prefix) throw new Error('You must pass a prefix for the client.');
        if (typeof options.prefix !== 'string') throw new TypeError('Prefix should be a type of String.');
        this.prefix = options.prefix;

        if (!options.defaultPerms) throw new Error('You must pass default perm(s) for the Client.');
        this.defaultPerms = new Permissions(options.defaultPerms).freeze();
    }

    initPlayerEvents() {
        this.player
            .on('searchResults', (message, query, tracks) => {

                const embed = new MessageEmbed()
                    .setAuthor(`Here are your search results for ${query}!`)
                    .setDescription(tracks.map((t, i) => `${i + 1}. ${t.title}`))
                    .setFooter('Send the number of the song you want to play!')
                message.channel.send(embed);

            })
            .on('trackStart', (msg, track) => msg.channel.send(`Playing ${track.title} for **${track.requestedBy.tag}**. Enjoy >w<!`))
            .on('channelEmpty', (msg) => msg.channel.send('You must be in a voice channel... dummy >.<!'))
            .on('botDisconnect', (msg) => {
                msg.channel.send('That\'s it for now! Hope you enjoyed the show >w<')
                this.client.commands.get('disconnect').run(message);
            })
            .on('noResults', (msg) => msg.channel.send('Sowwy, couldn\'t find any song like that >.<'))
            .on('playlistAdd', (message, queue, playlist) => message.channel.send(`${playlist.title} has been added to the queue (${playlist.items.length} songs)!`))
            .on('trackAdd', (msg, queue, track) => msg.channel.send(`Added the ${track.title} to the queue for you >w<! It will play after ${queue.tracks.length - 1} ${queue.tracks.length === 2 ? 'song' : 'songs'}`))
            .on('queueEnd', (msg) => msg.channel.send('Well that\'s all the songs you have requested! Anything else you want me to play OwO?'))
            .on('searchInvalidResponse', (msg) => msg.channel.send('I am not sure what was that supposed to mean >.<, try again please.'))
            .on('searchCancel', (msg) => console.log('FIX SEARCHCANCEL IN NYABOTCLIENT')) //TODO
            .on('error', (msg, err) => {
                switch (err) {
                    case 'NotPlaying':
                        msg.channel.send('There is no music being played >~<')
                        break;
                    case 'NotConnected':
                        msg.channel.send('You are not connected in any of the voice channels >~<!')
                        break;
                    case 'UnableToJoin':
                        msg.channel.send('I am not able to join your voice channel QwQ, please check my permissions >~<!')
                        break;
                    default:
                        msg.channel.send(`Something went wrong QwQ... Error: ${err}`)
                }
            });
        console.log('Succesfully initialized Player!');
    }

    async start(token = this.token) {
        this.utils.loadCommands();
        this.utils.loadEvents();
        super.login(token);
    }

};