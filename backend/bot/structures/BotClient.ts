import { AllowedMentionsTypes, Client, ClientOptions, Collection, GatewayIntentBits, IntentsBitField, PermissionFlags, PermissionsBitField, Snowflake } from 'discord.js';
import { Command } from './Command';
import { Event } from './Event';
import { Slashcommand } from './Slashcommand';
import { LoadingUtils } from './../utils/InitUtils';
import logger from '../../utils/Logger';
import { ValidationUtils } from '../utils/ValidationUtils';
/**
 * General options that can be referenced from {@link Client}.
 * As well as some other custom which are:
 * 
 * @param {boolean} global - whether to publish slash commands globally
 * @param {{ allowedMentions: { parse: AllowedMentionsTypes[], repliedUser: boolean }}} allowedMentions
 * @param {GatewayIntentBits[]} intents
 * @param {Snowflake[]} creators
 * @param {Snowflake[]} owners
 * @param {bigint[]} defaultPermissions {@link PermissionFlags}
 * @param {string} commandPrefix
 * 
 */
export interface BotClientOptions extends ClientOptions {
    readonly global: boolean,
    // Whether to allow bot to ping users, roles, replies etc.
    readonly allowedMentions: {
        parse: AllowedMentionsTypes[],
        repliedUser: boolean
    },
    readonly intents: GatewayIntentBits[],
    readonly creators: Snowflake[],
    readonly owners: Snowflake[],
    readonly defaultPermissions: bigint[],
    readonly commandPrefix: string
}

/**
 * Core of the entire project. This is where the bot is "created".
 * Additionally as the bot instance is passed widely throughout the app
 * it houses utilities and other essential collections/instances.
 * 
 * Note to self: don't overbloat this class again, not everything needs to be accessible everywhere.
 */
export class BotClient extends Client {

    readonly global: boolean;
    readonly creators: Snowflake[];
    readonly owners: Snowflake[];
    readonly defaultPermissions: PermissionsBitField;
    readonly commandPrefix: string
    // These text commands are just for me, developer only basically
    // Stats, eval and other...
    commands: Collection<string, Command>;
    slashcommands: Collection<string, Slashcommand>;
    events: Collection<string, Event>;

    validationUtils: ValidationUtils;

    constructor(options: BotClientOptions) {
        super(options);
        this.global = options.global;
        this.creators = options.creators;
        this.owners = options.owners;
        this.defaultPermissions = new PermissionsBitField(options.defaultPermissions).freeze();
        this.commandPrefix = options.commandPrefix;

        this.commands = new Collection();
        this.slashcommands = new Collection();
        this.events = new Collection();

        // ↓↓↓ Utils here ↓↓↓
        this.validationUtils = new ValidationUtils(this);
        // ↑↑↑ Utils here ↑↑↑
    }

    async start(): Promise<void> {
        return new Promise(resolve => {
            // Validations, loadings etc.
            logger.debug('Started the bot login phase');
            const initUtils = new LoadingUtils(this);
            Promise.all([
                initUtils.loadAllCommandsEvents()
            ]).then(() => {
                logger.debug('Finished loading events, starting the login');
                super.login(process.env.BOT_TOKEN);
                resolve();
            })
        })
    }
}