import path from 'path';
require('dotenv').config({ path: path.join(__dirname, '../.env') });
import config from './bot/config/main';
import { BotClient } from './bot/structures/BotClient';
import { connect } from './database/Connection';
import logger from './utils/Logger';

logger.debug('Started the backend');
const client = new BotClient(config);
client.start()
    .then(() => {
        logger.debug(`Command collection size: ${client.commands.size}`);
        logger.debug(`Events collection size: ${client.events.size}`);
        logger.debug(`Slashcommand collection size: ${client.slashcommands.size}`);
    })
connect();