//This should go without prefice but this is a singleton class
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let connected = false;
// Connect MongoDB at default port 27017.
mongoose.connect('mongodb://localhost:27017/meowzers', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}, (err) => {
    if (!err) {
        console.log('MongoDB Connection Succeeded.');
        connected = true;
    } else {
        console.log('Error in DB connection: ' + err)
        connect = 'error'
    }
});

module.exports = class Database {

    isConnected() {
        return new Promise(resolve => {
            resolve(this.awaitConnection(false));
        })
    }

    awaitConnection(end) {
        if (end === true) {
            return (connected === 'error' ? false : true);
        }
        if (connected === true || connected === 'error') {
            this.awaitConnection(true);
        }
        if (end === false) {
            setTimeout(() => this.awaitConnection(false), 1000);
        }
    }
}