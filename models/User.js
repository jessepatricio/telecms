const mongoose = require('mongoose');
//use mongoose schema
const Schema = mongoose.Schema;
//define the schema
const UserSchema = new Schema({

    //relationships
    role: {
        type: Schema.Types.ObjectId,
        ref: 'roles'
    },

    username: {
        type: String,
        required: true,
        unique: true
    },

    firstname: {
        type: String,
        required: true
    },

    lastname: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    date: {
        type: Date,
        default: Date.now()
    }


}, {
    usePushEach: true
});



module.exports = mongoose.model('users', UserSchema);