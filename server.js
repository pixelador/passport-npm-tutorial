let express = require('express');
let app = express();
let port = process.env.PORT || 8080;
let mongoose = require('mongoose');
let passport = require('passport');
let flash = require('connect-flash');

let morgan = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let session = require('express-session');

let configDB = require('./config/database');

/**
 * Configuration
 */
mongoose.connect(configDB.url); // connect to database

// require('./config/passport')(passport); // pass passport for configuration

// setup express application
app.use(session({ secret: 'ilovescothyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

/**
 * Routes
 */
require('./app/routes.js')(app, passport); // load routes and pass in app and configured passport

/**
 * Launch
 */
app.listen(port);
console.log('App running on port: ' + port);
