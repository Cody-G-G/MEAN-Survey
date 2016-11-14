'use strict';

// setting up required dependencies, assigning them to objects
var logger = require('./public/js/logger');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./data/models/user');

// exposing this function to our app using module.exports
module.exports = function (passport) {

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user.id)
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    // local passport strategy for signing up users
    passport.use('local-signup',
        new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true

        }, function (req, username, password, done) {
            logger.log("Passport local-signup for user " + username + " !");

            // asynchronous
            // User.findOne wont fire unless data is sent back
            process.nextTick(function () {

                // check if the user already exists
                User.findOne({'username': username, 'password': password}, function (err, user) {
                    // if there are any errors, return the error
                    if (err)
                        return done(err);
                    // if the user already exists return and execute the done() callback
                    if (user) {
                        return done(null, false);
                    }
                    else { // if not, then create the user with the passed in username and password
                        var newUser = new User();
                        newUser.username = username;
                        newUser.password = newUser.generateHash(password);
                        newUser.save(function (err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                })
            })
        }));

    // local passport strategy for user login
    passport.use('local-login',
        new LocalStrategy({
                username: 'username',
                password: 'password',
                passReqToCallback: true

            }, function (req, username, password, done) {

                // check if the user exists
                User.findOne({'username': username}, function (err, user) {
                    if (err)
                        return done(err);
                    // if the user does not exist or password is wrong, then execute done() callback with a 'false' argument
                    if (!user || !user.validPassword(password))
                        return done(null, false);
                    // if the user does exist, then execute done() callback with user object as argument
                    return done(null, user);
                })
            }
        ));

};