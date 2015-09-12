/**
 * The city schema for the mongo DB. Although schemas are not necessary, 
 * sometimes they are nice for sanity.
 * However, changing the schema does not reverse engineer old documents in mongo
 * http://stackoverflow.com/questions/14287617/mongoose-changing-schema-format
 */
var mongoose = require('mongoose');

var CitySchema = new mongoose.Schema({
    name: String,
    image: {type: String, default:'img/default_city_image.jpg'},
    admin: String,
    adminPhone: String,
    adminEmail: String,
    updated_at: { type: Date, default: Date.now },
    organizations: Array,
    causes: Array
});

module.exports = mongoose.model('City', CitySchema);