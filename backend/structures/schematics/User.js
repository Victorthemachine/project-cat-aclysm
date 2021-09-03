const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    
});

//Export the model
module.exports = mongoose.model('User', userSchema);