const mongoose = require('mongoose');
//use mongoose schema
const Schema = mongoose.Schema;
//define the schema
const TaskSchema = new Schema({

    code: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    date: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('tasks', TaskSchema);