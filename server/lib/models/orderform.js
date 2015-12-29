// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('OrderForm', new Schema({
    name: String,
    items: Array,
    created_at: Date,
    updated_at: Date
}));

