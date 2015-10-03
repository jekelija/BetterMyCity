/** All of the API routes for creating and modifying users/organiations */
var express = require('express');
var router = express.Router();

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens

var users = require('../models/User.js');

// route to authenticate a user
router.post('/authenticate', function(req, res) {
    // find the user
    users.findOne({
        name: req.body.username
    }, function(err, user) {
        if (err) throw err;
        if (!user) {
            res.json({ success: false, message: 'Authentication failed. Username/password mismatch.' });
        } else if (user) {
            // check if password matches
            if (user.password != req.body.password) {
                res.json({ success: false, message: 'Authentication failed. Username/password mismatch.' });
            } else {

                // if user is found and password is right
                // create a token
                var token = jwt.sign(user, app.get('tokenSecret'), {
                    expiresInMinutes: 1440 // expires in 24 hours
                });

                // return the information including token as JSON
                res.json({
                    success: true,
                    message: 'Login Success!',
                    token: token
                });
            }   
        }
    });
}); 

// route to show all users
router.post('/', function(req, res) {
    console.log(req.body);
    res.json({
        success: false,
        message: 'Cannot register yet, not implemented server side yet'
    });
});

// route middleware to verify a token
// order is important; by placing it here, the authenticate method above does NOT use
// this middleware, but everything below does
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

// route to show all users
router.get('/', function(req, res) {
    users.find({}, function(err, users) {
        res.json(users);
    });
});


module.exports = router;