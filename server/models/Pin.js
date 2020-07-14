const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const pinSchema = new Schema({

    pin: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Pin', pinSchema);