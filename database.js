'use strict';

// setting up required dependencies, assigning them to objects
var mongoose = require('mongoose');
var logger = require('./public/js/logger');
var User = require('./data/models/user');
var SurveySubmission = require('./data/models/surveySubmission');

// establishing connection to database, and calling createAdminUser() function once the conenction is open
this.setup = function () {

    mongoose.connect('mongodb://localhost:27017/mongod');
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'Connection error!'));
    db.once('open', function () {
        logger.log("MongoDB connection open!");
        createAdminUser();
    });
};

// Check whether the user with the username and password passed in as parameters exists in the database,
// then execute callback function passed in as 3rd parameter ("callback") with boolean as argument signifying whether
// the user was found or not
this.isUserValid = function (usernameParam, passwordParam, callback) {
    var query = User.findOne({username: usernameParam, password: passwordParam});

    query.exec(function (err, data) {
        if (err)
            logger.log(err);
        else
            callback(data ? true : false);
    });
};

// Saves the submission object to the database, with the passed in "entries" and "user" objects as fields
this.saveSubmission = function (entries, user) {
    var submission = new SurveySubmission({
        entries: entries,
        user: user
    });
    submission.save();
};

// Retrieves the submission object for the passed in user, and executed the passed in callback function with the
// returned data object as parameter
this.getSubmission = function (userParam, callback) {
    var query = SurveySubmission.findOne({user: userParam});

    query.exec(function (err, data) {
        if (err)
            logger.log(err);
        else
            callback(data);
    });
};

// Creates and persists the admin user to the database
function createAdminUser() {
    var admin = new User();
    admin.username = 'admin';
    admin.password = admin.generateHash('boss');
    admin.save();
}