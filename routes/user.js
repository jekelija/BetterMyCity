/** All of the API routes for creating and modifying users/organiations */
var express = require('express');
var router = express.Router();
var app = require('../app');

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens

var users = require('../models/User.js');

// route to authenticate a user
router.post('/authenticate', function(req, res) {
    // find the user
    users.findOne({
        username: req.body.username
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

// route to create a user
router.post('/', function(req, res) {
    console.log('Adding ' + req.body);
    var user = new users(
        {
            username: req.body.username,
            password: req.body.password,
            salt: String,
            firstName: req.body.firstName,
            lastName: req.body.lastName, 
            email: req.body.email,
            phone: '',
            address: '',
            cities: [],
            privacyOptions: '' 
        }
    );
   
    //save actually places it in DB
    user.save(function (err) {
        if (err) {
            res.json({
                success: false,
                message: 'Cannot save user ' + req.body.username + ' to database... dont know why yet!'
            });
        }
        else {
            res.json({
                success: true,
                message: 'Successfully registered ' + req.body.username + '; please log in!'
            });
        }
    })
    
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

// route to get user information
router.get('/:username', function(req, res) {
    users.findOne({username:req.params.username}, function(err, user) {
        if (err) {
            return res.json({ success: false, message: 'Failed to authenticate token.' });    
        }
        else {
            //send user along
            return res.json({ success: false, user:user });    
        }
    });
});


module.exports = router;