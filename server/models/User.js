const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true
  },
  mobileNumber: {
    type:Number,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true
  },
  isAdmin: { type: Boolean, required: true, default: false }
});

module.exports  = mongoose.model('user', UserSchema);


