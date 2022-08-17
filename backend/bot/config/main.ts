import { AllowedMentionsTypes, IntentsBitField, PermissionFlagsBits } from 'discord.js';
import { BotClientOptions } from '../structures/BotClient'
const main = {
    'global': false,
    'allowedMentions': {
        'parse': [AllowedMentionsTypes.User, AllowedMentionsTypes.Role],
        'repliedUser': true
    },
    'intents': [
        IntentsBitField.Flags.DirectMessages,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildInvites,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildVoiceStates,
        IntentsBitField.Flags.GuildMessageReactions,
        IntentsBitField.Flags.DirectMessageReactions
    ],
    'creators': ['393861290373677066', '500736834536603648'],
    'owners': ['393861290373677066', '500736834536603648'],
    'defaultPermissions': [
        PermissionFlagsBits.AddReactions,
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.SendMessages
    ],
    'commandPrefix': 'bat!'
}
export default main as BotClientOptions;