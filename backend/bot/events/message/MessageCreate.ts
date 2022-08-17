import { Message } from "discord.js";
import { Event } from "../../structures/Event";


export default class extends Event {

    async run(message: Message): Promise<void> {
        // Necessary validation
        const mentionRegex = RegExp(`^<@!?${this.client.user!.id}>$`);
        const mentionRegexPrefix = RegExp(`^<@!?${this.client.user!.id}> `);
        if (!message.guild || message.author.bot) return;

        // Command validation
        if (message.content.match(mentionRegex)) message.channel.send(`My prefix for ${message.guild.name} is \`${this.client.commandPrefix}\`.`);

        const prefix = message.content.match(mentionRegexPrefix) ?
            message.content.match(mentionRegexPrefix)![0] : this.client.commandPrefix;

        if (message.content.startsWith(prefix) === false) return;

        const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);
        const command = this.client.commands.get(cmd.toLowerCase());

        if (command) {
            if (this.client.validationUtils.isCreator(message.author.id) === false) {
                message.reply('Text commands are reserved for creators of the bot only.');
                return;
            }

            if (command.guildOnly && !message.guild) {
                message.reply('Sorry, this command can only be used in a discord server.');
                return;
            }

            if (command.args && !args.length) {
                message.reply(`Sorry, this command requires arguments to function. Usage: ${command.usage ?
                    `${this.client.commandPrefix + command.name} ${command.usage}` : 'This command doesn\'t have a usage format'}`);
                return;
            }

            if (message.guild) {
                const botPermCheck = command.botPerms ? this.client.defaultPermissions.add(command.botPerms) : this.client.defaultPermissions;
                if (botPermCheck) {
                    // @ts-ignore
                    const missing = message.channel.permissionsFor(this.client.user).missing(botPermCheck);
                    if (missing.length) {
                        message.reply(`I am missing [${missing.join(', ')}] permissions, I need them to run this command!`);
                        return;
                    }
                }
            }

            command.run(message, args);
            return;
        }

    }
}