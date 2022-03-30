const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const Review = new mongoose.Schema( 
{   bookId: {type:ObjectId,
           required: true,
         ref:"Createbooks"},
    reviewedBy: {type:String,
         required:true, 
         default: "Guest"
         },
    reviewedAt: {type:Date,
         required:true},
    rating: {type:Number, 
        min: 1, 
        max: 5, 
        required:true},
    review: {type:String, required: true},
    isDeleted: {type:Boolean, default: false},
  }

  ,{timestamps:true});

  module.exports = mongoose.model('review',Review)