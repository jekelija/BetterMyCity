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

module.exports = router;

