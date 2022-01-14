const vm = require('vm');
const logger = require('./../Logger');
const { Constants: { ApplicationCommandOptionTypes } } = require('discord.js')
let clientInstance;

const setClient = (client) => {
    clientInstance = client;
}
const extractSlashCommandOptions = (interaction) => {
    const cmdOptions = {};
    if (interaction.isCommand() === false) return cmdOptions;
    console.log(interaction.options.data)
    if (clientInstance && clientInstance.slashCommands.has(interaction.commandName)) {
        clientInstance.slashCommands.get(interaction.commandName).options.forEach(option => {
            console.log(option.name);
            //console.log(ApplicationCommandOptionTypes);
            console.log(ApplicationCommandOptionTypes[option.type]);
            console.log(`options.get${ApplicationCommandOptionTypes[option.type].charAt(0)}${(ApplicationCommandOptionTypes[option.type].toLowerCase()).slice(1)}()`)
            try {
                console.log(option);
                console.log(interaction.options.getInteger('num1'));
                cmdOptions[option.name] = (new vm.Script(`console.log(interaction.options.get${ApplicationCommandOptionTypes[option.type].charAt(0)}${(ApplicationCommandOptionTypes[option.type].toLowerCase()).slice(1)}(${option.name}))`)).runInNewContext([{ 'interaction': interaction }, { 'option': option }]);
            } catch (err) {
                logger.warn(err);
            }
        });
        return cmdOptions;
    } else {
        return cmdOptions;
    }
}

module.exports = {
    setClient,
    extractSlashCommandOptions
}