/** All of the API routes for CRUD of cities */
var express = require('express');
var router = express.Router();

var items = require('../models/Item.js');

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
                return res.json({ success: false, message: 'Failed to authenticate token.' });    
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

// route to create an offer on a city
//router.post('/:cityId/offers', function(req, res) {
//    console.log('Adding ' + req.body);
//    cities.findOne({_id:req.params.cityId}, function(err, city) {
//        if (err) {
//            return res.json({ success: false, message: 'Error retrieving city information' });    
//        }
//        else if(city == null) {
//            return res.json({ success: false, message: 'Error finding city in database from ID provided' });    
//        }
//        else {
//              TODO this is where i left off... still need to provide username to req and actually post data from form
//            city.offers.
//        }
//    });
//    var item = new items(
//        {
//            subject: req.body.subject,
//            description: req.body.description,
//            poster_id: req.body.poster_id
//        }
//    );
//   
//    //save actually places it in DB
//    item.save(function (err) {
//        if (err) {
//            res.json({
//                success: false,
//                message: 'Cannot save offer to database due to an unknown error'
//            });
//        }
//        else {
//            res.json({
//                success: true,
//                message: 'Successfully added new offer'
//            });
//        }
//    })
//});

module.exports = router;

