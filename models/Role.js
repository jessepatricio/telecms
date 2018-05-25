const mongoose = require('mongoose');
//use mongoose schema
const Schema = mongoose.Schema;
//define the schema
const RoleSchema = new Schema({

    //fields

    rolename: {
        type: String,
        required: true
    },

    date: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('roles', RoleSchema);