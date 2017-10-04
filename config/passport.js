'use strict';
let LocalStrategy = require('passport-local').Strategy;
let User = require('../app/models/user'); // load the user model

// expose function to app using module.exports
module.exports = function(passport) {
  /**
   *  passport session setup - required for persistent login sessions
   *  passport needs ability to serialize/unserialize users out of session
   */

  // serialize user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // deserialize user for the session
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  /**
   * Local Signup
   */
  passport.use('local-signup', new LocalStrategy({
    // LocalStrategy user username/password by default
    // overriding with with email
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true // allows to pass request to the callback
  },
  function(req, email, password, done) {
    // asynchronous
    process.nextTick(function() {
      // find a user with email same as form input email
      User.findOne( { 'local.email' : email }, function(err, user) {
        // return error, if any
        if (err)
          return done(err);
        // check if user exists
        if (user) {
          // return message
          return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
        } else {
          // else create new user
          let newUser = new User();
          newUser.local.email = email;
          newUser.local.password = newUser.generateHash(password);

          // save the new user
          newUser.save(function(err) {
            if (err)
              throw err;

            return done(null, newUser);
          });
        }
      });
    });
  }));

  /**
   * Local Login
   */
  passport.use('local-login', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  },
  function(req, email, password, done) {
    // check if user exists
    User.findOne({ 'local.email' : email }, function(err, user) {

      // return if error
      if (err)
        return done(err);
      // if no user found, return message
      if (!user)
        return done(null, false, req.flash('loginMessage', 'No user found'));
      // if user, but wrong password
      if (!user.validPassword(password))
        return done(null, false, req.flash('loginMessage', 'Wrong password!'));
      // else all is well
      return done(null, user);
    });
  }));

};