var compression = require('compression');
var cookieParser = require('cookie-parser');
var express = require('express');
var logger = require('morgan');

require('./routes/commons');

var chatsRouter = require('./routes/chats');

const app = express();

app.use(compression());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use('/mock', chatsRouter);

module.exports = app;
