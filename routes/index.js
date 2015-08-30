var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Better My City' });
});

var cities = require('../models/City.js');

/* GET available cities */
router.get('/cities', function(req, res, next) {
  cities.find(function (err, result) {
      if (err) {
          return next(err);
      }
      res.json(result);
  });
});

module.exports = router;
