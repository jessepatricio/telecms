const mongoose = require('mongoose');
//use mongoose schema
const Schema = mongoose.Schema;
//define the schema
const CabinetSchema = new Schema({

    //fields
    name: {
        type: String,
        required: true
    },

    dropcount: {
        type: Number,
        required: false
    },

    date: {
        type: Date,
        default: Date.now()
    }

});

module.exports = mongoose.model('cabinets', CabinetSchema);