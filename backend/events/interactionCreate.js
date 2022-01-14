const Event = require('../structures/Event');
const vm = require('vm');
const { extractSlashCommandOptions } = require('./../structures/utils/InteractionExtractor');

module.exports = class extends Event {

    async run(interaction) {
        const contextObj = {
            context: interaction
        }
        try {
            //Good idea, combine with interaction.options to streamline
            console.log(vm.runInNewContext('context.isCommand()', contextObj));
        } catch (err) {
            console.error(err);
        }
        console.log(extractSlashCommandOptions(interaction));
        if (interaction.isCommand() === true) {
            this.client.slashCommands.get(interaction.commandName).execute(interaction);
        }
    }

};