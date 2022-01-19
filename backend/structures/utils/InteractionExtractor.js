const vm = require('vm');
const logger = require('./../Logger');
const { Constants: { ApplicationCommandOptionTypes } } = require('discord.js');
let clientInstance;

const setClient = (client) => {
	clientInstance = client;
};

const extractSlashCommandOptions = (interaction) => {
	const cmdOptions = {};
	if (interaction.isCommand() === false) return cmdOptions;
	if (clientInstance && clientInstance.slashCommands.has(interaction.commandName)) {
		clientInstance.slashCommands.get(interaction.commandName).options.forEach(option => {
			try {
				const context = {
					interaction: interaction,
					option: option
				};
				vm.createContext(context);
				const script = `interaction.options.get${ApplicationCommandOptionTypes[option.type].charAt(0)}${ApplicationCommandOptionTypes[option.type].toLowerCase().slice(1)}('${option.name}')`;
				cmdOptions[option.name] = vm.runInContext(script, context);
			} catch (err) {
				logger.warn(err);
			}
		});
		logger.info('------------------cmdOptions------------------');
		logger.info(JSON.stringify(cmdOptions));
		logger.info('----------------------------------------------');
		return cmdOptions;
	} else {
		return cmdOptions;
	}
};

module.exports = {
	setClient,
	extractSlashCommandOptions
};
