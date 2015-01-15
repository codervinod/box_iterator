var express = require('express')
  , router = express.Router();

var passport = require('passport')
  , BoxStrategy = require('passport-box').Strategy;

var Box = require('nodejs-box');

var BOX_CLIENT_ID = "nj2xh160hkq0il10iubz3y29139h235c"
var BOX_CLIENT_SECRET = "FviL0zPKiLiiDjCBljrWPbvH2TuHoVO6";

var User = require("../lib/user").User;

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
      User.findOne({user_id:profile.id},function(err,user){
        if(err){
          console.log(err);
          return done(err);
        }

        if(user){
          user.accessToken = accessToken;
          user.refreshToken = refreshToken;
        }else{
          user = new User({
            user_id:profile.id,
            name:profile.name,
            login:profile.login,
            accessToken:accessToken,
            refreshToken:refreshToken
          });
        }        
        
        user.save(function(err){
          if(err) return done(err);
          console.log("added new box user to db:",user);
          return done(null,user);
        });
      });
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
    var box = new Box({
      access_token:req.user.accessToken,
      refresh_token:req.user.refreshToken
    });

    box.folders.root(function(err,box_res){
      if(err){
        console.log(err);
        return res.status(500).json({error:err});
      }
      console.log(res);
      res.json({response:box_res});
    });
  });


module.exports = router;