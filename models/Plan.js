const mongoose = require('mongoose');
//use mongoose schema
const Schema = mongoose.Schema;
//define the schema
const PlanSchema = new Schema({

    //relationships
    location: {
        type: Schema.Types.ObjectId,
        ref: 'locations'
    },

    //fields
    lno: {
        type: String,
        required: true
    },

    sheetno: {
        type: String,
        required: true
    },

    instruction: {
        type: String,
        required: true
    },

    code: {
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

    date: {
        type: Date,
        default: Date.now()
    }


}, {
    usePushEach: true
});



module.exports = mongoose.model('plans', PlanSchema);