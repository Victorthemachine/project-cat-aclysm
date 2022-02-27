const { Client, Collection, Permissions, Intents } = require('discord.js');
const Util = require('./utils/Util.js');
const Server = require('./Server');
const Database = require('./Database');
const DatabaseSingleton = new Database();
const MusicPlayer = require('./MusicPlayer');
const MusicUtil = require('./utils/MusicUtil.js');
const ServerUtils = require('./utils/ServerUtils');
const { setClient } = require('./utils/InteractionExtractor');
// const Logger = require('winston')

module.exports = class NyaBotClient extends Client {

	constructor(options = {}) {
		super({
			allowedMentions: {
				parse: ['users', 'roles'],
				repliedUser: true
			},
			intents: [
				Intents.FLAGS.GUILDS,
				Intents.FLAGS.GUILD_MEMBERS,
				Intents.FLAGS.GUILD_BANS,
				Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
				Intents.FLAGS.GUILD_INTEGRATIONS,
				Intents.FLAGS.GUILD_WEBHOOKS,
				Intents.FLAGS.GUILD_INVITES,
				Intents.FLAGS.GUILD_VOICE_STATES,
				Intents.FLAGS.GUILD_PRESENCES,
				Intents.FLAGS.GUILD_MESSAGES,
				Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
				Intents.FLAGS.GUILD_MESSAGE_TYPING,
				Intents.FLAGS.DIRECT_MESSAGES,
				Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
				Intents.FLAGS.DIRECT_MESSAGE_TYPING
			]
		});

		this.clientId = options.clientId;

		this.global = options.global;

		this.validate(options);

		this.commands = new Collection();

		this.aliases = new Collection();

		this.slashCommands = new Collection();

		this.events = new Collection();

		this.utils = new Util(this);

		this.musicUtils = new MusicUtil(this);

		this.serverUtils = new ServerUtils(this);

		this.owners = options.owners;

		this.server = new Server(this);

		this.db = DatabaseSingleton.getInstance();
		this.db.connect();

		this.player = new MusicPlayer(this);

		this.spamLog = {};
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

	async start(token = this.token) {
		setClient(this);
		this.utils.loadCommands();
		this.utils.loadSlashCommands()
			.then(() => {
				this.utils.registerSlashCommands(token, this.clientId, this.global);
			});
		this.utils.loadEvents();
		super.login(token);
	}

};
