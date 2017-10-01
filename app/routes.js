'use strict';
module.exports = function(app, passport) {
  /**
   * Homepage (with login links)
   */
  app.get('/', function(req, res) {
    res.render('index.ejs'); // load index.ejs file
  });

  /**
   * Login - show login form
   */
  app.get('/login', function(req, res) {
    // render the page, pass any flash data if it exists
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  // process login form
  // app.post('/login', do login stuff here );

  /**
   * Signup - show signup form
   */
  app.get('/signup', function(req, res) {
    // render the page, pass any flash data if it exists
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });
  
  // process signup form
  // app.post('/signup', process passport stuff here );

  /**
   * Profile section
   *  - Need to be logged in to view
   *  - Use route middleware to verify (the isLoggedIn function)
   */
  app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile.ejs'), {
      user : req.user // get user out of session and pass to template
    }
  });

  /**
   * Logout
   */
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

};

/**
 * Route middleware to make sure user is logged in
 */
function isLoggedIn(req, res, next) {
  // if user is authenticated in session, continue
  if (req.isAuthenticated())
    return next;
  // else redirect to homepage
  res.redirect('/');
}