import { Message, PermissionsBitField } from "discord.js";
import { BotClient } from "./BotClient";

export interface CommandOptions {
    readonly description?: string,
    readonly usage?: string,
    readonly botPerms?: PermissionsBitField,
    readonly guildOnly?: boolean,
    readonly args?: boolean
}

export abstract class Command {
    
    client: Required<BotClient>;
    readonly name: string;
    readonly description: string;
    readonly usage: string;
    readonly botPerms: PermissionsBitField;
    readonly guildOnly: boolean;
    readonly args: boolean;

    constructor(client: BotClient, name: string, options?: CommandOptions) {
        this.client = client;
        this.name = name;
        this.description = options && options.description ? options.description : 'No description provided';
        this.usage = `${this.client.commandPrefix}${this.name} ${options && options.usage ? options.usage : ''}`.trim();
        this.botPerms = options && options.botPerms ? new PermissionsBitField(options.botPerms).freeze() : new PermissionsBitField().freeze();
        this.guildOnly = options && options.guildOnly ? options.guildOnly : false;
        this.args = options && options.args ? options.args : false;
    }

    async run(message: Message, args: string[]) {}
}