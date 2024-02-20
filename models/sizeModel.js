const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var sizeSchema = new mongoose.Schema({
    size:{
        type:String,
        required:[true,'Enter sizes'],
        unique:true,
        index:true,
    },
});

//Export the model
module.exports = mongoose.model('Size', sizeSchema);