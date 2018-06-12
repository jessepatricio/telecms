const mongoose = require('mongoose');
//use mongoose schema
const Schema = mongoose.Schema;
//define the schema
const CpaSchema = new Schema({

    //fields
    location: {
        type: String,
        required: true
    },

    abffpid: {
        type: String,
        required: true
    },

    mduct1: {
        type: String,
        required: true
    },

    mduct2: {
        type: String,
        required: false
    },

    way26tube: {
        type: String,
        required: false
    },

    way10tube: {
        type: String,
        required: false
    },

    way12tube: {
        type: String,
        required: false
    },

    way7tube: {
        type: String,
        required: false
    },

    way4tube: {
        type: String,
        required: false
    },

    streetnumber: {
        type: String,
        required: true
    },

    streetname: {
        type: String,
        required: true
    },

    status: {
        type: String,
        required: true,
        default: 'not tested'
    },

    remarks: {
        type: String,
        required: false
    },

    date: {
        type: Date,
        default: Date.now()
    }

});

module.exports = mongoose.model('cpas', CpaSchema);