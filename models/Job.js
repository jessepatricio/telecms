// const mongoose = require('mongoose');
// //use mongoose schema
// const Schema = mongoose.Schema;
// //define the schema
// const JobSchema = new Schema({

//     //relationship

//     user: {
//         type: Schema.Types.ObjectId,
//         ref: 'users'
//     },

//     //fields

//     lno: {
//         type: String,
//         required: true
//     },

//     code: {
//         type: String,
//         required: true
//     },

//     description: {
//         type: String,
//         required: true
//     },

//     status: {
//         type: String,
//         default: 'incomplete',
//     },

//     date: {
//         type: Date,
//         default: Date.now()
//     }


// });



// module.exports = mongoose.model('jobs', JobSchema);