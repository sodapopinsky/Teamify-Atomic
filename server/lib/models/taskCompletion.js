// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('TaskCompletion', new Schema({
    date: Date,
    _user: { type: Schema.Types.ObjectId, ref: 'User' },
    _task: { type: Schema.Types.ObjectId, ref: 'Task' }
}));