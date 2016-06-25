/** All of the API routes for CRUD of cities */
var express = require('express');
var router = express.Router();

//CRUD below
/* GET available cities */
var cities = require('../models/City.js');
router.get('/', function(req, res, next) {
    cities.find(function (err, result) {
        if (err) {
            return next(err);
        }
        res.json(result);
    });
});

// route to get user information
router.get('/:cityId', function(req, res) {
    cities.findOne({_id:req.params.cityId}, function(err, city) {
        if (err) {
            return res.json({ success: false, message: 'Error retrieving city information' });    
        }
        else if(city == null) {
            return res.json({ success: false, message: 'Error finding city in database from ID provided' });    
        }
        else {
            //send user along
            return res.json({ success: true, city:city });    
        }
    });
});

module.exports = router;

