const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var storeSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Provide Name of Store'],
        unique:true,
    },
    link:{
        type:String,
        required:[true,'Provide Link to the store'],
    },
    logo:{
        type:String,
        
    },
    desc:{
        type:String,
    }

});

//Export the model
module.exports = mongoose.model('Store', storeSchema);