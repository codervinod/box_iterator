var express = require('express')
	, router = express.Router();

var passport = require('passport')
  , BoxStrategy = require('passport-box').Strategy;

var BOX_CLIENT_ID = "nj2xh160hkq0il10iubz3y29139h235c"
var BOX_CLIENT_SECRET = "FviL0zPKiLiiDjCBljrWPbvH2TuHoVO6";

//var User = require("../lib/user").User;

// Use the BoxStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and 37signals
//   profile), and invoke a callback with a user object.
passport.use(new BoxStrategy({
    clientID: BOX_CLIENT_ID,
    clientSecret: BOX_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/box/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {

    	console.log(accessToken);
    	console.log(refreshToken);
    	console.log(profile);
      
      // To keep the example simple, the user's Box profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Box account with a user record in your database,
      // and return that user instead.
      /*
      winston.info("gp profile:",profile);

    var user_id = 'gp:'+profile.id;

    User.findById(user_id,function(err,user,can_create){
      if(err) {
        if(!can_create)
          return done(err);
        
        user = new User(
          {
            user_id:user_id,
            strategy:'google',
            first_name:profile.name.givenName,
            last_name:profile.name.familyName,
            profile_created:false
          });

        user.save(function(err){
            if(err) done(err);

            winston.info("added new google user to db:",user);
            done(null,user);
        });
        return;
      }
      done(null,user);
      winston.info("authenticated existing google user from db:",user);
    });
      */
      return done(null, profile);
    });
  }
));


// GET /auth/Box
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Box authentication will involve
//   redirecting the user to Box.com.  After authorization, Box
//   will redirect the user back to this application at /auth/box/callback
router.get('/',
  passport.authenticate('box'),
  function(req, res){
    // The request will be redirected to Box for authentication, so this
    // function will not be called.
  });

// GET /auth/box/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
router.get('/callback', 
  passport.authenticate('box', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });


module.exports = router;