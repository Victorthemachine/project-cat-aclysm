import { PermissionsBitField, Message, PermissionFlagsBits } from "discord.js";
import { BotClient } from "../structures/BotClient";
import { Command, CommandOptions } from "../structures/Command";

export default class extends Command {

    constructor(client: BotClient, name: string, options?: CommandOptions) {
        super(client, name, { ...options,
            description: 'Does a ping test and writes out the result',
            botPerms: new PermissionsBitField(PermissionFlagsBits.SendMessages)
        })
    }


    async run(message: Message<boolean>, args: string[]): Promise<void> {
        const msg = await message.channel.send({ content: 'Pinging...' });
        msg.edit({ content: `My ping is ${msg.createdTimestamp - message.createdTimestamp}ms, API latency: ${this.client.ws.ping}ms`});
        return;
    }
    
}
