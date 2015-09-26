/**
 * The organization schema for the mongo DB. Although schemas are not necessary, 
 * sometimes they are nice for sanity.
 * However, changing the schema does not reverse engineer old documents in mongo
 * http://stackoverflow.com/questions/14287617/mongoose-changing-schema-format
 */
var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    salt: String,
    firstName: String,
    lastName: String, 
    phone: String,
    address: String,
    privacyOptions: String,
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);