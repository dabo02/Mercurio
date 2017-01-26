var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  // res.header('Content-Type:', 'application/json');
  res.writeHead(200, {'Content-Type': 'application/json'});
  next();
});
var notification = require('./routes/notification');
app.post('/sendNotification', notification.sendPushNotification);
