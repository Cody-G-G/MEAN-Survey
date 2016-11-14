'use strict';

// setting up required dependencies, assigning them to objects
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var passport = require('passport');
var path = require('path');
var logger = require('./public/js/logger');
var db = require("./database");
var app = express();

// setting up passport configurations, passing in the passport object
require('./passport')(passport);

// setting up the Express application object
app
    .use(bodyParser.json()) // Parses the incoming requests text as JSON and exposes the resulting object on req.body.
    .use(cookieParser()) // read cookies (needed for auth)
    .use(morgan('dev')) // log every request to the console

    // setup required for passport authentication
    .use(session({secret: 'topsecret'}))
    .use(passport.initialize())
    .use(passport.session()) // persistent login sessions


    .use(express.static('../public')) // expose all files under '../public' statically, so they can all be accessed through the proper URL
    .use('/vendor', express.static(__dirname + '/node_modules')) // replace the '../node_modules' exposed route with '/vendor'
    .use('/scripts', express.static(__dirname + '/public/js')) // replase the '../public/js' exposed route with '/scripts'

    // === Defining the various server routes / REST endpoints ===

    // '/api/register' POST endpoint used to register a new user with the passport 'local-signup' authentication strategy
    .post('/api/register', passport.authenticate('local-signup'), function (req, res) {
        res.status(200).send();
    })

    // '/api/login' POST endpoint used to perform user login with the passport 'local-login' authentication strategy
    .post('/api/login', passport.authenticate('local-login'), function (req, res) {
        res.status(200).send();
    })

    // '/api/survey' POST endpoint used to save the survey data passed in the request body
    .post('/api/survey', function (req, res) {
        logger.log("POST /api/survey with data " + JSON.stringify(req.body));
        db.saveSubmission(req.body, req.user.username);
        res.status(200).send();
    })
    // '/api/survey' GET endpoint used to retrieve a survey submission object, sending the data in the response body
    .get('/api/survey', function (req, res) {
        db.getSubmission(req.user.username, function (data) {
            res.status(200).send(data);
        });
    })
    // '/api/logout' GET endpoint used to perform user logout, destroying the current session and clearing the session cookie
    .get('/api/logout', function (req, res) {
        req.session.destroy(function () {
            res.clearCookie('connect.sid');
            res.status(200).send();
        });
    })
    // '/api/submissionexists' GET endpoint used to get the survey submission data for the currently logged in user
    .get('/api/submissionexists', function (req, res) {
        db.getSubmission(req.user.username, function (data) {
            res.status(200).send(data ? true : false);
        });
    })
    // route that sends the index.html file for any other URL not corresponding to the ones defined above
    .get('*', checkLoggedIn, function (req, res) {
        res
            .status(200)
            .set({'content-type': 'text/html; charset=utf-8'})
            .sendFile('/public/views/index.html', {root: path.resolve(__dirname, './')});
    })
    .on('error', function (error) {
        logger.log('Error: \n' + error.message);
        console.log(error.stack);
    });

// handles various scenarios and limits user access to routes based on whether logged in or not
// -> if logged in --> if trying to access login / register page, redirect to survey
//                 --> else, do nothing
// -> if not logged in --> if trying to access anything other than login / register / static file, then redirect to login
//                     --> else, do nothing
function checkLoggedIn(req, res, next) {
    var requestUrl = req.url.toString();
    var reqUrlForLoggedIn =
        requestUrl.indexOf('login') == -1 &&
        requestUrl.indexOf('register') == -1;

    if (req.isAuthenticated() && reqUrlForLoggedIn)
        return next();
    else if (!req.isAuthenticated() && reqUrlForLoggedIn) // if user accessing URL for which he should be logged in (any other than login/ register
        res.redirect('/login');
    else if (req.isAuthenticated() && !reqUrlForLoggedIn) // if user is authenticated and tries to access login / register url
        res.redirect('/survey');
    else next();
}

db.setup();
app.listen(8080);