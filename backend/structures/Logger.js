const { createLogger, format, transports, addColors } = require('winston');
require('winston-daily-rotate-file');
const { combine, timestamp, printf } = format;
// eslint-disable-next-line no-shadow
const useFormat = printf(({ level, message, timestamp }) => `${timestamp}: [${level}] ${message}`);

addColors({
	colors: {
		crit: 'bold red',
		error: 'red',
		warn: 'yellow',
		info: 'green',
		debug: 'black'
	}
});

const logger = createLogger({
	transports: [
		new transports.Console(),
		new transports.DailyRotateFile({
			filename: 'nya-bot-%DATE%.log',
			datePattern: 'YYYY-MM-DD-HH',
			zippedArchive: true,
			maxSize: '20m',
			maxFiles: '14d',
			dirname: './../logs/'
		})
	],
	levels: {
		crit: 0,
		error: 1,
		warn: 2,
		info: 3,
		debug: 4
	},
	format: combine(
		timestamp(),
		useFormat
	)
});
module.exports = logger;
