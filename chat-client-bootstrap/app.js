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

app.use('/load-chat', express.static(path.join(__dirname, 'public')));

// JS paths. Using the below you can refer the JS like this: http://localhost:3003/packages/jquery-slim/jquery.slim.js
app.use('/packages/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));
app.use('/packages/jquery-slim', express.static(path.join(__dirname, 'node_modules/jquery/dist')));

module.exports = app;
