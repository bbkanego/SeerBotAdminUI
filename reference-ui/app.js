var compression = require('compression');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

app.use(compression({threshold: 0}));

// https://expressjs.com/en/guide/using-middleware.html
app.use(function(req, res, next) {
  // cache the content for 1 day ie 86400 seconds
  res.setHeader('Cache-Control', 'public, max-age=86400');
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use('/customer', express.static(path.join(__dirname, 'public')));

module.exports = app;
