import { REST } from '@discordjs/rest';
import { Collection, Events, Routes } from 'discord.js';
import glob from 'glob';
import path from 'path';
import vm from 'vm';
import logger from '../../utils/Logger';
import { BotClient } from '../structures/BotClient';
import { Command } from '../structures/Command';
import { Event } from '../structures/Event';
import { Slashcommand } from '../structures/Slashcommand';

function getCurrentDirectory() {
    // Backslashes are wrongly interpreted by glob >> replace them all with forwardslashes
    return `${path.dirname(__dirname)}${path.sep}`.replaceAll('\\', '/');
}

export class LoadingUtils {
    private client: BotClient;

    constructor(client: BotClient) {
        this.client = client;
    }

    loadAllCommandsEvents(): Promise<void> {
        return new Promise(resolve => {
            logger.debug('Attempting to load everything');
            Promise.all([
                this.loadCommands(),
                this.loadSlashCommands(),
                this.loadEvents()
            ]).then(() => resolve());
        })
    }

    /**
     * * It is recommended to use {@link loadAllCommandsEvents} instead!
     * 
     * Loads commands in "commands" folder.
     * 
     * @returns Promise
     * 
     * @throws TypeError
     */
    loadCommands(): Promise<void> {
        return new Promise(async resolve => {
            logger.debug('Trying to load all commands');
            glob(`${getCurrentDirectory()}commands/*.js`, (err, commands) => {
                logger.debug(`${getCurrentDirectory()}commands/*.js`);
                if (err) {
                    logger.crit(err);
                    throw new Error(err.stack);
                }
                logger.debug(commands);
                for (const commandFile of commands) {
                    delete require.cache[commandFile];
                    const { name } = path.parse(commandFile);
                    const File = require(commandFile);
                    console.log(File);
                    const command = new File.default(this.client, name.toLowerCase());
                    if (!(command instanceof Command)) throw new TypeError(`Command ${name} doesn't belong in Commands`);
                    console.log(`Before setting command: ${this.client.commands.size}`);
                    this.client.commands.set(command.name, command);
                    console.log(`After setting command: ${this.client.commands.size}`);
                }
            });
            logger.debug('Loaded all commands');
            resolve();
        })
    }

    /**
     * * It is recommended to use {@link loadAllCommandsEvents} instead!
     * 
     * Loads events in "events" folder.
     * 
     * @returns Promise
     */
    loadEvents(): Promise<void> {
        return new Promise(async resolve => {
            logger.debug('Trying to load all events');
            glob(`${getCurrentDirectory()}events/**/*.js`, (err, events) => {
                logger.debug(`${getCurrentDirectory()}events/**/*.js`);
                if (err) {
                    logger.crit(err);
                    throw new Error(err.stack);
                }
                logger.debug(events);
                for (const eventFile of events) {
                    delete require.cache[eventFile];
                    const { name } = path.parse(eventFile);
                    logger.debug(`Event by the name ${name}`);
                    logger.debug(`${name in Events === false ? 'Didn\'t pass the condition' : 'Passed the condition'}`)
                    if (name in Events === false) throw new ReferenceError('No such event exists in Discord.js');
                    const File = require(eventFile);
                    const event = new File.default(this.client, name);
                    if (!(event instanceof Event)) throw new TypeError(`Event ${name} doesn't belong in Events`);
                    console.log(`Before setting event: ${this.client.events.size}`);
                    this.client.events.set(event.name, event);
                    console.log(`After setting event: ${this.client.events.size}`);
                    // event.emitter[event.type](name, (...args) => event.run(...args));
                    //this.client[event.type](name, (...args) => event.run(...args));
                    const context = {
                        event: event,
                        client: this.client
                    }
                    const script = `client.${event.type}('${Events[name as keyof typeof Events]}', (...args) => event.run(...args))`;
                    console.log('Script is:', script);
                    vm.createContext(context);
                    vm.runInContext(script, context);
                }
            });
            logger.debug('Loaded all events');
            resolve();
        })
    }

    /**
     * Private function, do not expose. This function serves no purpose
     * unless combined with {@link registerSlashCommands} as it needs to be
     * hooked into Discord API to be useful. This merely loads all slashcommands
     * into a {@link Collection} accessible in {@link BotClient}.
     * 
     * @returns Promise
     */
    private loadSlashCommands(): Promise<void> {
        return new Promise(async resolve => {
            logger.debug('Trying to load all slashcommands');
            glob(`${getCurrentDirectory()}slashcommands/**/*.js`, (err, slashCommands) => {
                logger.debug(`${getCurrentDirectory()}slashcommands/**/*.js`);
                if (err) {
                    logger.crit(err);
                    throw new Error(err.stack);
                }
                logger.debug(slashCommands);
                for (const slashCommandFile of slashCommands) {
                    delete require.cache[slashCommandFile];
                    const { name } = path.parse(slashCommandFile);
                    const File = require(slashCommandFile);
                    const command = new File.default(this.client, name.toLowerCase());
                    if (!(command instanceof Slashcommand)) throw new TypeError(`Slashcommand ${name} doesn't belong in Slashcommands!`);
                    const slashCommand = {
                        data: command.toJSON()
                    };
                    this.client.slashcommands.set(slashCommand.data.name, command);
                }
            });
            logger.debug('Loaded all slashcommands');
            resolve();
        })
    }

    /**
     * * It is recommended to use {@link loadAllCommandsEvents} instead!
     * 
     * Loads slashcommands in "slashcommands" folder.
     * 
     * @returns Promise
     */
    registerSlashCommands(): Promise<void> {
        return new Promise(async resolve => {
        await this.loadSlashCommands();
        const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN as string);
        try {
            if (this.client.global === true) {
                await rest.put(
                    Routes.applicationCommands(process.env.BOT_ID as string),
                    { body: this.client.slashcommands }
                );
            } else {
                await rest.put(
                    Routes.applicationGuildCommands(process.env.BOT_ID as string, process.env.LOCAL_CMD_GUILD_ID as string),
                    { body: this.client.slashcommands }
                );
            }
        } catch (error) {
            console.error(error);
        }
            resolve();
        })
    }

}