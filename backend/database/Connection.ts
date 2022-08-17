import mongoose from 'mongoose';
import logger from './../utils/Logger';

export declare type ConnectOptions = mongoose.ConnectOptions;
// TODO: add connection automatic repair mechanic/checking
class Connection {
    connected: boolean = false;
    connectOptions: ConnectOptions = {
        autoIndex: false,
        autoCreate: true
    }

    constructor(connectOptions?: ConnectOptions) {
        if (connectOptions) {
            this.connectOptions = connectOptions;
        }
    }

    async connect(): Promise<boolean> {
        if (this.connected === false) {
            try {
                await mongoose.connect(`${process.env.MONGO_URL}/${process.env.MONGO_DB_NAME}`, this.connectOptions)
                logger.info('Successfully connected to the database!');
                this.connected = true;
            } catch (err) {
                logger.crit(err);
                this.connected = false;
            }
        } else {
            logger.info('Connection to the database was already established!');
        }
        return this.connected;
    }
}

export function connect(options ?: ConnectOptions): Promise<boolean> {
    return new Promise<boolean> (resolve => {
        /**
         * (Haven't found any interface or anything all I found is this comment in mongoose types)
         * (I don't know what to tell you just follow lead of the creators ¯\_(ツ)_/¯)
         * Connection ready state
         *
         * - 0 = disconnected
         * - 1 = connected
         * - 2 = connecting
         * - 3 = disconnecting
         */
        switch (mongoose.connection.readyState) {
            case 1:
                resolve(true);
                break;
            case 2:
                mongoose.connection
                    .once('open', () => resolve(true))
                    .on('error', (err) => {
                        logger.crit(err);
                        resolve(false);
                    });
                break;
            case 3:
                resolve(false);
                break;
            default:
                const myConnection = options ? new Connection(options) : new Connection();
                myConnection.connect()
                    .then(success => resolve(success));
                break;
        }
    })
}

export function isConnected(): boolean {
    if (mongoose.connection.readyState === 1) {
        return true;
    } else {
        return false;
    }
}

export function getConnection(): mongoose.Connection {
    if (isConnected() === false) {
        throw new ReferenceError('Connection does not exist');
    }
    return mongoose.connection;
} 