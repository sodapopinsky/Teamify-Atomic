var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Notification', new Schema({
    updated_at: {type:Date, default:Date.now()},
    _created_by: { type: Schema.Types.ObjectId, ref: 'User' },
    requires_acknowledge: {type:Boolean, default:false},
    recipients: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    read_receipts:Array,
    subject: String,
    message: String
}));