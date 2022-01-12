const Event = require('../structures/Event');
const vm = require('vm');

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

        if (interaction.isCommand() === true) {
            this.client.slashCommands.get(interaction.commandName).execute(interaction);
        }
    }

};