/** All of the API routes for CRUD of cities */
var express = require('express');
var router = express.Router();

//must include app/jwt to deal with tokens
var app = require('../app');
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens

var CityModel = require('../models/City.js');
var Item = CityModel.Item;


//CRUD below
/* GET available cities */
var City = CityModel.City;
router.get('/', function(req, res, next) {
    City.find(function (err, result) {
        if (err) {
            return next(err);
        }
        res.json(result);
    });
});

// route to get user information
router.get('/:cityId', function(req, res) {
    City.findOne({_id:req.params.cityId}, function(err, city) {
        if (err) {
            res.json({ success: false, message: 'Error retrieving city information' });    
        }
        else if(city == null) {
            res.json({ success: false, message: 'Error finding city in database from ID provided' });    
        }
        else {
            //send user along
            res.json({ success: true, city:city });    
        }
    });
});

// route middleware to verify a token
// order is important; by placing it here, everything above does not need authentication to proceed, 
// but everything below does
router.use(function(req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, app.get('tokenSecret'), function(err, decoded) {      
            if (err) {
                res.json({ success: false, message: 'Failed to authenticate token.' });    
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;    
                next();
            }
        });

    } else {
        // if there is no token
        // return an error
        return res.status(403).send({ 
            success: false, 
            message: 'No token provided.' 
        });
    }
});

function addFunction(cityId, subject, description, poster_id, isOffer, res) {
    City.findOne({_id:cityId}, function(err, city) {
        if (err) {
            res.json({ success: false, message: 'Error retrieving city information' });    
        }
        else if(city == null) {
            res.json({ success: false, message: 'Error finding city in database from ID provided' });    
        }
        else {
            var newItem = new Item(
                {
                    subject: subject,
                    description: description,
                    poster_id: poster_id
                }
            );
            if(isOffer) {
                city.offers.push(newItem);
            }
            else {
                city.requests.push(newItem);
            }
            city.save(function (err) {
                if (err) {
                    res.json({
                        success: false,
                        message: 'Cannot save new item ' + subject + ' to database... dont know why yet!'
                    });
                }
                else {
                    res.json({
                        success: true,
                        message: 'Successfully added ' + subject,
                        city: city //return the updated city
                    });
                }
            });
        }
    });
}

// route to create an offer on a city
router.post('/:cityId/offers', function(req, res) {
    console.log('Adding offer ' + req.body);
    addFunction(req.params.cityId, req.body.subject, req.body.description, req.body.poster_id, true /*isOffer*/, res);
});

// route to create a request on a city
router.post('/:cityId/requests', function(req, res) {
    console.log('Adding request ' + req.body);
    addFunction(req.params.cityId, req.body.subject, req.body.description, req.body.poster_id, false /*isOffer*/, res);
});

module.exports = router;

