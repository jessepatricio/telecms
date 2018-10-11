const mongoose = require('mongoose');
//use mongoose schema
const Schema = mongoose.Schema;
//define the schema
const JobSchema = new Schema({

    //relationship
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },

    addedby: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },

    modifiedby: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },

    cabinet: {
        type: Schema.Types.ObjectId,
        ref: 'cabinets'

    },

    task: {
        type: Schema.Types.ObjectId,
        ref: 'tasks'

    },

    //fields
    lno: {
        type: String,
        required: false
    },

    withDig: {
        type: Boolean,
        default: false
    },

    withBackfill: {
        type: Boolean,
        default: false
    },

    remarks: {
        type: String,
        required: false
    },

    streetno: {

        type: String,
        required: false

    },

    streetname: {

        type: String,
        required: false

    },

    status: {
        type: String,
        default: 'incomplete'
    },

    file: {
        type: String
    },

    jobdate: {
        type: String,
        required: true
    },

    timestamp: {
        type: Date,
        default: Date.now()
    },

    date: {
        type: Date,
        default: Date.now()
    }

});

module.exports = mongoose.model('jobs', JobSchema);