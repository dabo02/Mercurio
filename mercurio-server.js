var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var https = require('https');
var qs = require('querystring');
var loop = require('lupus');
var x2j = require('xml2json');

var routes = require('./routes/index');
var users = require('./routes/users');
var notification = require('./routes/notification');

var app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', routes);
//app.use('/users', users);
//app.get('/bower_components/*', express.static(__dirname + '/public/bower_components/'))
app.use('/node_modules', express.static(__dirname + '/node_modules'))

app.use('/assets', express.static(__dirname + '/public/assets'));
app.use('/audio', express.static(__dirname + '/public/audio'));
app.use('/bower_components', express.static(__dirname + '/public/bower_components'));
app.use('/src', express.static(__dirname + '/public/src'));
app.use('/images', express.static(__dirname + '/public/images'));
app.use('/lib', express.static(__dirname + '/public/lib'));

app.post("/insertLead", function(req, res){

  var d = '\<Leads>'+
      '\<row no="1">'+
      '\<FL val="Lead Source">'+req.body.leadInfo.leadSource+'\</FL>'+
      '\<FL val="Company">'+req.body.leadInfo.company+'\</FL>'+
      '\<FL val="First Name">'+req.body.leadInfo.firstName+'\</FL>'+
      '\<FL val="Last Name">'+req.body.leadInfo.lastName+'\</FL>'+
      '\<FL val="Email">'+req.body.leadInfo.email+'\</FL>'+
      '\<FL val="Title">'+req.body.leadInfo.title+'\</FL>'+
      '\<FL val="Phone">'+req.body.leadInfo.phone+'\</FL>';

  if (req.body.leadInfo.homePhone) {
    d += '\<FL val="Home Phone">'+req.body.leadInfo.homePhone+'\</FL>';
  }
  if (req.body.leadInfo.mobile) {
    d += '\<FL val="Mobile">'+req.body.leadInfo.mobile+'\</FL>';
  }
  if (req.body.leadInfo.otherPhone) {
    d += '\<FL val="Other Phone">'+req.body.leadInfo.otherPhone+'\</FL>';
  }
  if (req.body.leadInfo.fax) {
    d += '\<FL val="Fax">'+req.body.leadInfo.fax+'\</FL>';
  }
  d+= '\</row>'+
  '\</Leads>';

  var queryInfo = qs.stringify({
    'authtoken':req.body.token,
    'scope': 'crmapi',
    'xmlData': d
  });
  var options = {
    host: "crm.zoho.com",
    port: 443,
    path: '/crm/private/xml/Leads/insertRecords',
    method: 'POST',
    headers: {
      accept: '*/*',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(queryInfo)
    }
  };

  var cleanData;
  var EventEmitter = require("events").EventEmitter;
  var body = new EventEmitter();
  var request = https.request(options, function(response) {
    response.on('data', function(data){
      body.data = data;
      body.emit('update');
    });
  });

  request.on('error', function(e) {
    console.error(e);
  });
  request.write(queryInfo);
  request.end();
  body.on('update', function () {
    cleanData = x2j.toJson(body.data.toString());
    res.send(cleanData);
  });
});

app.post("/insertAccount", function(req, res){

  var d = '\<Accounts>'+
      '\<row no="1">'+
      '\<FL val="Account Name">'+req.body.acctInfo.acctName+'\</FL>'+
      '\<FL val="Website">'+req.body.acctInfo.website+'\</FL>'+
      '\<FL val="Employees">'+req.body.acctInfo.employees+'\</FL>'+
      '\<FL val="Ownership">'+req.body.acctInfo.ownerShip+'\</FL>'+
      '\<FL val="Industry">'+req.body.acctInfo.industry+'\</FL>'+
      '\<FL val="Account Type">'+req.body.acctInfo.acctType+'\</FL>'+
      '\<FL val="Account Number">'+req.body.acctInfo.acctNumber+'\</FL>';

  if (req.body.acctInfo.phone) {
    d += '\<FL val="Phone">'+req.body.acctInfo.phone+'\</FL>';
  }
  if (req.body.acctInfo.annualRevenue) {
    d += '\<FL val="Mobile">'+req.body.acctInfo.annualRevenue+'\</FL>';
  }
  if (req.body.acctInfo.description) {
    d += '\<FL val="Other Phone">'+req.body.acctInfo.description+'\</FL>';
  }
  if (req.body.acctInfo.fax) {
    d += '\<FL val="Fax">'+req.body.acctInfo.fax+'\</FL>';
  }
  d+= '\</row>'+
  '\</Accounts>';

  var queryInfo = qs.stringify({
    'authtoken':req.body.token,
    'scope': 'crmapi',
    'xmlData': d
  });
  var options = {
    host: "crm.zoho.com",
    port: 443,
    path: '/crm/private/xml/Accounts/insertRecords',
    method: 'POST',
    headers: {
      accept: '*/*',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(queryInfo)
    }
  };

  var cleanData;
  var EventEmitter = require("events").EventEmitter;
  var body = new EventEmitter();
  var request = https.request(options, function(response) {
    response.on('data', function(data){
      body.data = data;
      body.emit('update');
    });
  });

  request.on('error', function(e) {
    console.error(e);
  });
  request.write(queryInfo);
  request.end();
  body.on('update', function () {
    cleanData = x2j.toJson(body.data.toString());
    res.send(cleanData);
  });
});

app.post("/insertCalls", function (req, res) {

  var d = '\<Calls>' +
      '\<row no="1">' +
      '\<FL val="SMOWNERID">' + req.body.smOwnerId + '\</FL>' +
      '\<FL val="Subject">' + req.body.subject + '\</FL>' +
      '\<FL val="Call Type">' + req.body.callType + '\</FL>';
  if (req.body.callPurpose) {
    d += '\<FL val="Call Purpose">' + req.body.callPurpose + '\</FL>';
  }
  if (req.body.module === 'Contacts') {
    d+= '\<FL val="CONTACTID">' + req.body.id + '\</FL>';
  } else {
    d += '\<FL val="SEID">' + req.body.id + '\</FL>';
  }
  d += '\<FL val="SEMODULE">'+req.body.module+'\</FL>';

  if (req.body.startTime) {
    d += '\<FL val="Call Start Time">' + req.body.startTime + '\</FL>';
  }
  if (req.body.duration) {
    d += '\<FL val="Call Duration">' + req.body.duration + '\</FL>';
  }
  if (req.body.description) {
    d += '\<FL val="Description">' + req.body.description + '\</FL>';
  }
  if (req.body.billable) {
    d += '\<FL val="Billable">' + req.body.billable + '\</FL>';
  }
  if (req.body.result) {
    d += '\<FL val="Call Result">' + req.body.result + '\</FL>';
  }
  if (req.body.callFromTo) {
    d += '\<FL val="Call From/To">' + req.body.callFromTo + '\</FL>';
  }
  d += '\</row>' +
      '\</Calls>';

  var queryInfo = qs.stringify({
    'authtoken':req.body.token,
    'scope': 'crmapi',
    'xmlData': d
  });
  var options = {
    host: "crm.zoho.com",
    port: 443,
    path: '/crm/private/xml/Calls/insertRecords',
    method: 'POST',
    headers: {
      accept: '*/*',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(queryInfo)
    }
  };

  var cleanData;
  var EventEmitter = require("events").EventEmitter;
  var body = new EventEmitter();
  var request = https.request(options, function(response) {
    response.on('data', function(data){
      body.data = data;
      body.emit('update');
    });
  });

  request.on('error', function(e) {
    console.error(e);
  });
  request.write(queryInfo);
  request.end();
  body.on('update', function () {
    cleanData = x2j.toJson(body.data.toString());
    res.send(cleanData);
  });

});

app.post("/fetchRecords", function(req, res) {

  var queryInfo = qs.stringify({
    'newFormat': '1',
    'authtoken': req.body.token,
    'scope': 'crmapi',
    'criteria': "((Phone:" + req.body.telNumber + ")OR(Mobile:" + req.body.telNumber + ")OR(Home Phone:" + req.body.telNumber + ")OR(Other Phone:" + req.body.telNumber + "))"
  });

  var contactOptions = {
    host: "crm.zoho.com",
    port: 443,
    path: '/crm/private/json/Contacts/searchRecords',
    method: 'POST',
    headers: {
      accept: '*/*',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(queryInfo)
    }
  };

  var records = {
    Leads: [],
    Contacts: [],
    Accounts: []
  }
  var EventEmitter = require("events").EventEmitter;
  var contactBody = new EventEmitter();
  var request = https.request(contactOptions, function (response) {
    response.on('data', function (data) {
      contactBody.data = data;
      contactBody.emit('update');
    });
  });

  request.on('error', function (e) {
    console.error(e);
  });

  request.write(queryInfo);
  request.end();

  contactBody.on('update', function () {
    var cleanData = JSON.parse(contactBody.data.toString());
    if (!cleanData.response.result || cleanData.response.nodata || cleanData.response.error) {
      records.Contacts = [];
    }
    else {
      if (cleanData.response.result.Contacts) {
        if (Object.prototype.toString.call(cleanData.response.result.Contacts.row) === '[object Array]') {
          cleanData.response.result.Contacts.row.forEach(function (contact) {
            var contactRecord = {
              contactId: "",
              smOwnerId: "",
              name: ""
            };
            contactRecord.contactId = contact.FL[0].content;
            contactRecord.smOwnerId = contact.FL[1].content;
            contactRecord.name = contact.FL[3].content + " " + contact.FL[4].content;
            records.Contacts.push(contactRecord);
          });
        } else {
          var contactRecord = {
            contactId: "",
            smOwnerId: "",
            name: ""
          };
          contactRecord.contactId = cleanData.response.result.Contacts.row.FL[0].content;
          contactRecord.smOwnerId = cleanData.response.result.Contacts.row.FL[1].content;
          contactRecord.name = cleanData.response.result.Contacts.row.FL[3].content + " " + cleanData.response.result.Contacts.row.FL[4].content;
          records.Contacts.push(contactRecord);
        }
      }
    }

    var acctOptions = {
      host: "crm.zoho.com",
      port: 443,
      path: '/crm/private/json/Accounts/searchRecords',
      method: 'POST',
      headers: {
        accept: '*/*',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(queryInfo)
      }
    };
    var acctBody = new EventEmitter();
    var request = https.request(acctOptions, function (response) {
      response.on('data', function (data) {
        acctBody.data = data;
        acctBody.emit('update');
      });
    });
    request.on('error', function (e) {
      console.error(e);
    });

    request.write(queryInfo);
    request.end();
    acctBody.on('update', function() {
      var cleanData = JSON.parse(acctBody.data.toString());
      if (!cleanData.response.result || cleanData.response.nodata || cleanData.response.error) {
        records.Accounts = [];
      }
      else {
        if (cleanData.response.result.Accounts) {
          if (Object.prototype.toString.call(cleanData.response.result.Accounts.row) === '[object Array]') {
            cleanData.response.result.Accounts.row.forEach(function (account) {
              var accountRecord = {
                accountId: "",
                smOwnerId: "",
                name: ""
              };
              accountRecord.accountId = account.FL[5].content;
              accountRecord.smOwnerId = account.FL[4].content;
              accountRecord.name = account.FL[3].content;
              records.Accounts.push(accountRecord);
            });
          } else {
            var accountRecord = {
              accountId: "",
              smOwnerId: "",
              name: ""
            };
            accountRecord.accountId = cleanData.response.result.Accounts.row.FL[5].content;
            accountRecord.smOwnerId = cleanData.response.result.Accounts.row.FL[4].content;
            accountRecord.name = cleanData.response.result.Accounts.row.FL[3].content;
            records.Accounts.push(accountRecord);
          }
        }
      }
      var leadOptions = {
        host: "crm.zoho.com",
        port: 443,
        path: '/crm/private/json/Leads/searchRecords',
        method: 'POST',
        headers: {
          accept: '*/*',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(queryInfo)
        }
      };
      var leadBody = new EventEmitter();
      var request = https.request(leadOptions, function (response) {
        response.on('data', function (data) {
          leadBody.data = data;
          leadBody.emit('update');
        });
      });
      request.on('error', function (e) {
        console.error(e);
      });

      request.write(queryInfo);
      request.end();
      leadBody.on('update', function() {
        var cleanData = JSON.parse(leadBody.data.toString());
        if (!cleanData.response.result || cleanData.response.nodata || cleanData.response.error) {
          records.Leads = [];
        }
        else {
          if (cleanData.response.result.Leads) {
            if (Object.prototype.toString.call(cleanData.response.result.Leads.row) === '[object Array]') {
              cleanData.response.result.Leads.row.forEach(function (lead) {
                var leadRecord = {
                  leadId: "",
                  smOwnerId: "",
                  name: ""
                };
                leadRecord.leadId = lead.FL[0].content;
                leadRecord.smOwnerId = lead.FL[1].content;
                leadRecord.name = lead.FL[2].content;
                records.Leads.push(leadRecord);
              });
            } else {
              var leadRecord = {
                leadId: "",
                smOwnerId: "",
                name: ""
              };
              leadRecord.leadId = cleanData.response.result.Leads.row.FL[0].content;
              leadRecord.smOwnerId = cleanData.response.result.Leads.row.FL[1].content;
              leadRecord.name = cleanData.response.result.Leads.row.FL[4].content + " " + cleanData.response.result.Leads.row.FL[5].content;
              records.Leads.push(leadRecord);
            }
          }
        }
        res.send(records);
      });
    });
  });
});

app.post('/validateToken', function (req, res) {

  var queryInfo = qs.stringify({
    'authtoken':req.body.token,
    'scope': 'crmapi',
    'type': 'api'
  });
  var options = {
    host: "crm.zoho.com",
    port: 443,
    path: '/crm/private/json/Info/getModules',
    method: 'POST',
    headers: {
      accept: '*/*',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(queryInfo)
    }
  };

  var cleanData;
  var EventEmitter = require("events").EventEmitter;
  var body = new EventEmitter();
  var request = https.request(options, function(response) {
    response.on('data', function(data){
      body.data = data;
      body.emit('update');
    });
  });

  request.on('error', function(e) {
    console.error(e);
  });
  request.write(queryInfo);
  request.end();
  body.on('update', function () {
    cleanData = body.data.toString();
    res.send(cleanData);
  });

});

app.post('/sendNotification', notification.sendPushNotification);

app.all('/*', function(req, res) {
  // Just send the index.html for other files to support HTML5Mode
  res.sendFile(__dirname + '/public/index.html');
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
    res.status(err.status || 500).send('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500).send({
    message: err.message,
    error: {}
  });
});


module.exports = app;
