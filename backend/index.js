const NyaBotClient = require('./structures/NyaBotClient');
const config = require('./configuration/mainBotConfig.json');

const client = new NyaBotClient(config);
client.start();

module.exports = client;
