var express = require('express');
var router = express.Router();

//MAYBE we could turn this into a SPA, so we only need to render a single page,
//thus reducing these calls that are specific to web navigation, and allowing the
//server to be pretty agnostic to the platform accessing it
//However, not sure if the app is too large to be SPA

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('pages/index');
});

/* GET who-we-are page. */
router.get('/who-we-are', function(req, res, next) {
  res.render('pages/who-we-are');
});

/* GET find-my-city page. */
router.get('/find-my-city', function(req, res, next) {
  res.render('pages/find-my-city');
});

/* GET contact page. */
router.get('/contact', function(req, res, next) {
  res.render('pages/contact');
});

//CRUD below
/* GET available cities */
var cities = require('../models/City.js');
router.get('/cities', function(req, res, next) {
  cities.find(function (err, result) {
      if (err) {
          return next(err);
      }
      res.json(result);
  });
});

module.exports = router;
