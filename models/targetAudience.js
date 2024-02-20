const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var targetAudienceSchema = new mongoose.Schema({
    target:{
        type:String,
        required:[true,'Enter the Target Audience'],
        unique:true,
        index:true,
    },
});

//Export the model
module.exports = mongoose.model('TargetAudience', targetAudienceSchema);