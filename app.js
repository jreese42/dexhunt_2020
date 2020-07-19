var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs');
var pug = require('pug');

const WebSocket = require('ws');

var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Pug for Client side
// Compile the client templates function strings, output functions into a client-side js script
var jsFunctionString = pug.compileFileClient('views/client/ui_gameTurn.pug', {name: "render_gameTurn"});
fs.writeFileSync("public/javascripts/templates.js", jsFunctionString);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist'))); // redirect JS jQuery
// app.use(express.static(path.join(__dirname, 'node_modules/vorple/dist'))); //Vorple

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
