import { createLogger, transports, format, addColors } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file'

const ignoreDebug = format((info, opts) => {
    // console.warn(info.level);
    // console.warn(info.level === 'debug' && process.env.MODE === 'PRODUCTION');
    if ((info.level === 'debug' && process.env.MODE === 'PRODUCTION') === true) return false;
    return info;
});

const myFormat = format.printf(({ level, message, timestamp, ...metadata }) => {
    let msg = `[${timestamp}] [${level}]: ${message}`;
    if (metadata && Object.keys(metadata).length > 0) {
        msg += JSON.stringify(metadata);
    }
    return msg;
});

const myLevels = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        debug: 3,
    },
    colors: {
        error: 'bold red',
        warn: 'yellow',
        info: 'black',
        debug: 'black'
    }
}
addColors(myLevels.colors);

const dailyTransport: DailyRotateFile = new DailyRotateFile({
    filename: 'nya-bot-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    dirname: './../logs/'
});

// TODO: add MongoDB logging here (see: https://github.com/winstonjs/winston-mongodb)
// TODO: add Express.js logging here with addition of morgan (see: https://coralogix.com/blog/complete-winston-logger-guide-with-hands-on-examples/)
const logger = createLogger({
    levels: myLevels.levels,
    format: format.combine(
        ignoreDebug(),
        format.colorize(),
        format.splat(),
        format.timestamp(),
        myFormat
    ),

    transports: [
        dailyTransport,
        new transports.Console({
            level: 'debug'
        }),
    ],
    exitOnError: false
});

logger.info('Logger initiliazed');
export default logger;