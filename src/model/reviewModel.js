const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId
const user = new mongoose.Schema( 
{
    bookId: {ObjectId,
         required:true, 
         ref:bookModel},
    reviewedBy: {type:String,
         required:true, 
         default: Guest, 
         value: reviewername},
    reviewedAt: {Date,
         required:true},
    rating: {Number, 
        minlength: 1, 
        maxlength: 5, 
        required:true},
    review: {type:String, optional},
    isDeleted: {boolean, default: false},
  }

  ,{timestamps:true});

  module.exports = mongoose.model('', user)