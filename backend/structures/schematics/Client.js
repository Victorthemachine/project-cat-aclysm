const mongoose = require('mongoose'); // Erase if already required
const BOT_CONSTANTS = require('./../../configuration/botConstants');

// Declare the Schema of the Mongo model
var clientSchema = new mongoose.Schema({
    network: {
        uuid: String
    },
    discord: {
        userId: String,
        supporter: Boolean,
    }
}, { timestamps: true });


/**
 * BASICALLY REWRITE THE WHOLE QUERY BCS I DIDN'T READ IT TO THE END
 * @param {*} id 
 * @returns 
 */
clientSchema.statics.findByUserId = function (id) {
    return this.find({ discord: { userId: id } });
}

clientSchema.statics.findByToken = function (token) {
    return this.find({ network: { uuid: token } });
}

clientSchema.statics.verifyToken = function (token) {
    return new Promise(resolve => {
        console.log(`${token} || ${this.token}`);
        this.find({ network: { uuid: token } }).then(function (results) {
            let updatedResults = [];
            console.log(results);
            console.log(results.createdAt)
            if (results.length > 0) {
                console.log('==================================================')
                results.forEach(function(res, index) {
                    console.log((new Date(res.createdAt).getTime() + (BOT_CONSTANTS.milis.minute * 15)) <= Date.now());
                    if ((new Date(res.createdAt).getTime() + (BOT_CONSTANTS.milis.minute * 15)) <= Date.now()) {
                        this.deleteOne(res);
                    } else {
                        updatedResults.push(res);
                    }
                }.bind(this))
                console.log('==================================================')
            }
            resolve(updatedResults.length > 0 ? true : false);    
        }.bind(this))
    })
}

//Export the model
module.exports = mongoose.model('Client', clientSchema);
