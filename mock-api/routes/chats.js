var express = require('express');

const router = express.Router();

const ACCESS_CONTROL_ORIGIN_HEADER = 'Access-Control-Allow-Origin';
const ACCESS_CONTROL_HEADERS_HEADER = 'Access-Control-Allow-Headers';
const ACCESS_CONTROL_EXPOSE_HEADER = 'Access-Control-Expose-Headers';
const ACCESS_CONTROL_ALLOW_METHODS = 'Access-Control-Allow-Methods';

router.options('/chats', (req, res, next) => {
  res.setHeader(ACCESS_CONTROL_ORIGIN_HEADER, '*');
  res.setHeader(ACCESS_CONTROL_HEADERS_HEADER, 'content-type,authorization');
  res.setHeader(ACCESS_CONTROL_EXPOSE_HEADER, 'content-type,authorization');
  res.setHeader(ACCESS_CONTROL_ALLOW_METHODS, 'get,post,put,delete,options');
  res.sendStatus(200);
});

router.post('/chats', (req, res, next) => {
  res.setHeader(ACCESS_CONTROL_ORIGIN_HEADER, '*');
  res.setHeader(ACCESS_CONTROL_HEADERS_HEADER, 'content-type,authorization');
  res.setHeader(ACCESS_CONTROL_EXPOSE_HEADER, 'content-type,authorization');
  res.setHeader(ACCESS_CONTROL_ALLOW_METHODS, 'get,post,put,delete,options');

  res.type('json');

  res.status(200).send(commons.utils.loadJSON('initiate'));
});

router.get('/chats/initiate', (req, res, next) => {
  res.setHeader(ACCESS_CONTROL_ORIGIN_HEADER, '*');
  res.setHeader(ACCESS_CONTROL_HEADERS_HEADER, 'content-type,authorization');
  res.setHeader(ACCESS_CONTROL_EXPOSE_HEADER, 'content-type,authorization');
  res.setHeader(ACCESS_CONTROL_ALLOW_METHODS, 'get,post,put,delete,options');

  res.type('json');

  res.status(200).send(commons.utils.loadJSON('initiate'));
});


module.exports = router;
