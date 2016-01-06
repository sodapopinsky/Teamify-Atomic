// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Timecard', new Schema({
    user: {_id:String,first_name:String,last_name:String}
    ,
    clock_in: Date,
    clock_out: Date,
    position: String
}));