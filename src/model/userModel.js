const mongoose = require('mongoose');
require('mongoose-type-email');
const UserSchema = new mongoose.Schema({

    title: {
        type: String,
        unique: true,
        required: true, 
        enum: ["Mr", "Mrs", "Miss"],
        trim: true,
    },
  name: {
        type: String,
        required: true, 
        trim: true,
    },
  phone: {
        type: Number,
        required: true,
        match: [/^([+]\d{10})?\d{15}$/, "Enter 10 Digit Valid Mobile Number"],
        unique: true,
        trim:true
      },
  email: {
          type:String,
            required:true,
            match: [/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/, 'Please fill a valid email address'], 
            unique:true, 
            lowercase : true,
            trim:true
        },

    password: {
        type: String,
        trim:true,
        required: true,
         minLen: 8, 
         maxLen :15
        },
address: {
      street: {
          type: String,
          trim: true,
          required: true
    },
    city: {
        type: String,
        trim: true,
        required: true
      },
      pincode: {
          type: String,
          trim: true,
          required: true
      },
      
    },
    
 },{timestamps:true});

  
module.exports = mongoose.model('User', UserSchema)
