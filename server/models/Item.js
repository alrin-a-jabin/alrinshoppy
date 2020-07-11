const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  packageName: {
    type: String,
    required: true
  },
  amount: {
    type:String,
    required:true
  },
  itemsList:
  [
    {
      itemName:{
        type:String,
        required:true
      },
      quantity:{
        type:String,
        required:true
      }
    }
  ]
});

module.exports  = mongoose.model('item', ItemSchema);