const mongoose = require('mongoose');
//use mongoose schema
const Schema = mongoose.Schema;
//define the schema
const ReinstatementSchema = new Schema({

    //relationships
    cabinet: {
        type: Schema.Types.ObjectId,
        ref: 'cabinets'
    },

    streetno: {

        type: String,
        required: false

    },

    streetname: {

        type: String,
        required: false

    },

    length:{ 
      
        type: Number,
        required: true
    },

    width:{ 
      
        type: Number,
        required: true
    },

    file: {
        type: String
    },

    date: {
        type: Date,
        default: Date.now()
    }


}, {
    usePushEach: true
});



module.exports = mongoose.model('reinstatement', ReinstatementSchema);