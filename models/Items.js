/**
 * The organization schema for the mongo DB. Although schemas are not necessary, 
 * sometimes they are nice for sanity.
 * However, changing the schema does not reverse engineer old documents in mongo
 * http://stackoverflow.com/questions/14287617/mongoose-changing-schema-format
 */
var mongoose = require('mongoose');

/**
 * The item schema is used for both requests and offers
 */
var ItemSchema = new mongoose.Schema({
    subject: String,
    description: String,
    poster_id: String,
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Item', ItemSchema);