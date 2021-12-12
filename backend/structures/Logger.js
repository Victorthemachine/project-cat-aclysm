const winston = require('winston');
require('winston-daily-rotate-file');
const { combine, timestamp, printf } = format;

const useFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp}: [${level}] ${message}`;
});

winston.addColors({
    colors: {
        crit: 'bold red',
        error: 'red',
        warn: 'yellow',
        info: 'green',
        debug: 'black'
    }
});

module.exports = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.DailyRotateFile({
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
    ),
});