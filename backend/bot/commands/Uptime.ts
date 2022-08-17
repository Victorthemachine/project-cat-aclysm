import { PermissionsBitField, Message, PermissionFlagsBits } from "discord.js";
import { BotClient } from "../structures/BotClient";
import { Command, CommandOptions } from "../structures/Command";
import { milisTime } from "../utils/TimeUtils";
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(duration);
dayjs.extend(relativeTime);

export default class extends Command {

    constructor(client: BotClient, name: string, options?: CommandOptions) {
        super(client, name, { ...options,
            description: 'Writes out how long has the bot been operational.',
            botPerms: new PermissionsBitField(PermissionFlagsBits.SendMessages)
        })
    }


    async run(message: Message<boolean>, args: string[]): Promise<void> {
        message.channel.send({ content: `My uptime is ${dayjs.duration(this.client.uptime!).humanize(false)}` });
        return;
    }
    
}
