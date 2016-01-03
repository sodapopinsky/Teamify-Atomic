
// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Inventory', new Schema({
    name: String,
    measurement: String,
    quantity_on_hand: {
        quantity: Number,
        updated_at: Date
    },
    usage_per_thousand: Number,
    par_type: String,
    par_value: Number,
    created_at: Date,
    updated_at: Date
}));