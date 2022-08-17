import { s } from '@sapphire/shapeshift';
import { Interaction, Message, PermissionsBitField, SlashCommandBuilder } from "discord.js";
import logger from '../../utils/Logger';
import { BotClient } from "./BotClient";

export interface SlashCommandOptions {
    readonly category: Category;
    readonly botPerms: PermissionsBitField;
    readonly userPerms: PermissionsBitField;
    readonly guildOnly: boolean; // DM perms
    readonly devOnly: boolean; // For commands in development > restriction
    readonly nsfw: boolean;
}

export abstract class Slashcommand extends SlashCommandBuilder {

    client: Required<BotClient>;
    readonly name: string;
    readonly description: string;
    readonly category: Category;
    readonly botPerms: PermissionsBitField;
    readonly userPerms: PermissionsBitField;
    readonly guildOnly: boolean;
    readonly devOnly: boolean;
    readonly nsfw: boolean;

    constructor(client: BotClient, name: string, description: string, options?: SlashCommandOptions) {
        super();
        this.client = client;
        if (this.validateName(name) === false) throw new TypeError(`Slash command name: "${name}" doesn't meet requirments.`);
        this.name = name;
        this.setName(name);
        if (this.validateDescription(description) === false) {
            logger.warn(`Slashcommand ${this.name} couldn't register ${description} as it's description as it doesn't meet requirments.`);
            this.description = 'No description provided';
        } else {
            this.description = description;
        }
        this.setDescription(this.description);
        this.category = options ? options.category : 'Miscellaneous';
        this.botPerms = options ? new PermissionsBitField(options.botPerms).freeze() : new PermissionsBitField().freeze();
        this.userPerms = options ? new PermissionsBitField(options.userPerms).freeze() : new PermissionsBitField().freeze();
        this.guildOnly = options ? options.guildOnly : false;
        if (this.guildOnly === true) this.setDMPermission(false);
        this.devOnly = options ? options.devOnly : false;        
        this.nsfw = options ? options.nsfw : false;
    }

    /**
     * I'd rather avoid hard to read Discord.js builder errors.
     * Works like {@link https://github.com/discordjs/discord.js/blob/3161e1a1acfbf929ecf33958fa1657553dd9bc1e/packages/builders/src/interactions/slashCommands/Assertions.ts#L8}
     * 
     * @param {string} name
     */
    private validateName(name: string): boolean {
        const predicate = s.string
            .lengthGreaterThanOrEqual(1)
            .lengthLessThanOrEqual(32)
            .regex(/^[\p{Ll}\p{Lm}\p{Lo}\p{N}\p{sc=Devanagari}\p{sc=Thai}_-]+$/u)
            .setValidationEnabled(false);
        return predicate.run(name).success;
    }

    /**
     * I'd rather avoid hard to read Discord.js builder errors.
     * Works like {@link https://github.com/discordjs/discord.js/blob/3161e1a1acfbf929ecf33958fa1657553dd9bc1e/packages/builders/src/interactions/slashCommands/Assertions.ts#L24}
     * 
     * @param {string} description
     */
    private validateDescription(description: string): boolean {
        const predicate = s.string
            .lengthGreaterThanOrEqual(1)
            .lengthLessThanOrEqual(100)
            .setValidationEnabled(false);
        return predicate.run(description).success;
    }

    async execute(interaction: Interaction, args: {}) { }
}