// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('employeeFile', new Schema({
    updated_at: Date,
    _user: { type: Schema.Types.ObjectId, ref: 'User' },
    entry_type: Number, //1: note, 2:writeup
    entry: String,
    _created_by: { type: Schema.Types.ObjectId, ref: 'User' }
}));