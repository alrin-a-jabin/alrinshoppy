const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true
  },
  amount: {
    type: String,
    required: true
  },
  itemsList:
    [
      {
        itemName: {
          type: String,
          required: true
        },
        quantity: {
          type: String,
          required: true
        }
      }
    ]
});

module.exports = mongoose.model('product', ProductSchema);