var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var passport = require('passport')
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var mongoose = require('mongoose');

var routes = require('./routes/index');
var users = require('./routes/users');

var User = require("./lib/user").User;

var app = express();

mongoose.connect('mongodb://localhost/box');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(expressSession({ secret: 'urlt_keyboard_cat',
                        saveUninitialized: true,
                        resave: true }));

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth/box',require('./routes/box'));

app.use('/', routes);
app.use('/users', users);

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

//Passport user serialize deserialzie section
passport.serializeUser(function(user, done) { //from user return id object
  done(null, user.user_id);
});

passport.deserializeUser(function(user_id, done) { //from id return user object
  User.findOne({user_id:user_id}, function(error, user) {
    done(error, user);
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
