// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Task', new Schema({
    name: String,
    description: String,
    updated_at: Date,
    _position: { type: Schema.Types.ObjectId, ref: 'Position' }
}));