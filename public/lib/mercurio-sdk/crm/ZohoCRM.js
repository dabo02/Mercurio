/*
@constructor
@params: title - string containing title of message
@params: participants - array containing a collection of particpants
*/

function ZohoCRM(crmId, insertCalls, name, token, type, validated){

    AbstractCRM.apply(this, arguments);
}

ZohoCRM.prototype = Object.create(AbstractCRM.prototype);

ZohoCRM.prototype.constructor = ZohoCRM;

/*

Requests server to login to CRM
@method
@abstract
*/

ZohoCRM.prototype.crmLogin = function(username, password, appName){
    throw new MissingImplementationError("Function login() is missing it's implementation!");
}

/*

 Requests CRM server to add a call to CRM
 @method
 @abstract
 @params: callInfo - JSON object with call attributes

 */
ZohoCRM.prototype.validateToken = function(crmOwnerId) {

	var self = this;
  var route = "/validateToken";
  var url = "crm.zoho.com";
  var succ = [];
  var data = {
    token: self.token,
    url: url
  };
  $.ajax({
    url: route,
    type: "post",
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify(data),
    dataType: "json",
    success: function (response) {
      succ.push(response);
      var validated = false;
      if (succ[0].response.error) {
        validated = false;
    
      } else {
        validated = true;
      }
      
      	var updates = {};
		updates['user-crms/' + crmOwnerId + "/" + self.crmId + "/validated"] = validated;
		firebase.database().ref().update(updates);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.warn(textStatus, errorThrown);
      console.warn(jqXHR.responseText);
    }

  });

}



ZohoCRM.prototype.addCall = function(callInfo, cb) {

  var route = "/insertCalls";
  var url = "crm.zoho.com";
  var succ = [];
  var data = {
    token: this.token,
    smOwnerId: callInfo.smOwnerId,
    subject: callInfo.subject,
    callType: callInfo.callType,
    callPurpose: callInfo.callPurpose,
    callFromTo: callInfo.callFromTo,
    id: callInfo.id,
    module: callInfo.module,
    startTime: callInfo.startTime,
    duration: callInfo.duration,
    description: callInfo.description,
    billable: callInfo.billable,
    result: callInfo.result,
    url: url
     };
  $.ajax({
    url: route,
    type: "post",
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify(data),
    dataType: "json",
    success: function (response) {
      var msg = {};
      succ.push(response);
      if (succ[0].response.error) {
          msg = {
            result: 'Error',
            message: succ[0].response.error.message
          };
      } else {
         msg = {
           result: 'Success',
           message: succ[0].response.result.message
         }
    }
	    cb(msg);
    },
    error: function (jqXHR, textStatus, errorThrown) {
	    var msg = {
		    result: 'Server Error',
		    message: 'Internal Server Error check connection or contact Mercury development team.'
	    };
	    cb(msg);
    }
  });

}

/*

Requests CRM server to add a lead to CRM
@method
@abstract leadInfo = {
  firstName: First name of lead entry
  lastName: Last name of lead entry *Required Field
  phone: phone of lead entry
  email: email of lead entry
  company: company of lead entry * Required Field
  title: title of lead entry
  * Other info about fields on ZOHO api documentation
  }
@params: leadInfo - JSON object with lead attributes
@params: cb - callback function

*/

ZohoCRM.prototype.addLead = function(leadInfo, cb) {

  var route = "/insertLead";
  var url = "crm.zoho.com";
  var succ = [];
  var data = {
    token: this.token,
    leadInfo: leadInfo,
    url: url
};
    $.ajax({
      url: route,
      type: "post",
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify(data),
      dataType: "json",
      success: function (response) {
        succ.push(response);
        if (succ) {
          cb(succ);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.warn(textStatus, errorThrown);
        console.warn(jqXHR.responseText);
      }

    });

}

ZohoCRM.prototype.addAccount = function(acctInfo, cb) {

  var route = "/insertAccount";
  var url = "crm.zoho.com";
  var succ = [];
  var data = {
    token: this.token,
    acctInfo: acctInfo,
    url: url
  };
  $.ajax({
    url: route,
    type: "post",
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify(data),
    dataType: "json",
    success: function (response) {
      succ.push(response);
      if (succ) {
        cb(succ);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.warn(textStatus, errorThrown);
      console.warn(jqXHR.responseText);
    }

  });

}
/*

 Requests CRM server to search a callable entity from the CRM Account
 @method
 @abstract
 @params: callInfo - string with telephone number for CRM query

 */

ZohoCRM.prototype.searchCallableRecords = function(phone, cb){
    var route = "/fetchRecords";
    var url = "crm.zoho.com";
    var callableRecords = [];
    var data = {
        token: this.token,
        telNumber: phone,
        url: url
    };
    $.ajax({
        url: route,
        type: "post",
        data: data,
        success: function (response) {
          callableRecords = response;
          cb(callableRecords);

        },
        error: function(jqXHR, textStatus, errorThrown) {
           console.warn(textStatus, errorThrown);
        }

    });
}