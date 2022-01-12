const extractSlashCommandOptions = (interaction) => {
    const cmdOptions = {};
    if (interaction.isCommand() === false) return cmdOptions;
    
}

module.exports = {
    extractSlashCommandOptions
}