const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Enter Product Title'],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref:'Brand',
      required:[true, 'Brand Must be Provided']
    },
    fashionModel:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'FashionModel'
    },
    images: [
      {
        public_id: String,
        url: String,
      },
    ],
    targetAudience:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:'TargetAudience',
      required:[true, 'Provide the Target Audience Id']

    }],
    colorway:{
      type:String,
    },
    color:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'Color',
      required:[true, 'Provide color id of the sneaker from colors'],
    },
    sneakerStores: [{
      store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
        required: [true, "Please provide the Store ID"],
      },
      price: {
        type: Number,
        required: [true, "Please provide the Price"],
      },
      availableSizes: [
        {
          type: mongoose.Schema.Types.ObjectId,
          required: [true, "Please provide the available Sizes Id's from the Sizes"],
        },
      ],
    }],
    releaseDate:{
      type: Date,
      required:[true, 'Please Enter the release time']
    },
    resell:{
      type:Boolean,
      default:false,
      required:[true, 'Provide if the sneaker is for resell true or false']
    },
    judgement:{
      type:String,
      required:[true, 'Provide judgement']
    }
  },
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Product", productSchema);
