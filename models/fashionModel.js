const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var fashionModelSchema = new mongoose.Schema({
    fashionmodel:{
        type:String,
        required:[true,'Please Provide the Fashion Model'],
        unique:true,
        index:true,
    },
    link:{
        type:String,
    }
});

//Export the model
module.exports = mongoose.model('FashionModel', fashionModelSchema);