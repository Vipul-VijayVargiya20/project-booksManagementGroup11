const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId
const Usermodel=require("../model/userModel")
const book = new mongoose.Schema({
      title: {type:String, 
        required:true, 
        unique:true},
excerpt: {type:String, 
    required:true}, 
 userId: {type:ObjectId, 
    required:true, 
    ref :Usermodel},
        ISBN: {type:String, 
            required:true, 
            unique:true},
        category: {type:String, 
            required:true},
        subcategory: {type:String, 
            required:true},
        reviews: {Number, 
            default: 0
            },
       
        isDeleted: {Boolean, 
            default: false}
        // releasedAt: {Date, 
        //     required:true},
        // createdAt:models.DateTimeField,default:timezone.now,
        // updatedAt: {timestamp},
      }
,{timestamps:true});
module.exports = mongoose.model('Createbook', book)