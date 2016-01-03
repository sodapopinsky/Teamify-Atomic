// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Organization', new Schema({
    name: String,
    default_projections: Array,
    created_at: Date,
    updated_at: Date,
    organization: String
}));

