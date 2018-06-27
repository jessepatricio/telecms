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

    plan: {
        type: Schema.Types.ObjectId,
        ref: 'plans'

    },

    task: {
        type: Schema.Types.ObjectId,
        ref: 'tasks'

    },

    //fields

    comments: {
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