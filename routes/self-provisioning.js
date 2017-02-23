var firebase = require('firebase');
// Initialize Firebase
var http = require('http-request');
// Development configs
var config = {
  apiKey: "AIzaSyAlTNQ0rX_z49-EL71e8le0vPew16g8WDg",
  authDomain: "mercurio-development.firebaseapp.com",
  databaseURL: "https://mercurio-development.firebaseio.com",
  storageBucket: "mercurio-development.appspot.com",
  messagingSenderId: "203647142462"
};

//Production configs
// var config = {
//   apiKey: "AIzaSyBYty0ff3hxlmwmBjy7paWCEalIrJxDpZ8",
//   authDomain: "mercurio-39a44.firebaseapp.com",
//   databaseURL: "https://mercurio-39a44.firebaseio.com",
//   storageBucket: "mercurio-39a44.appspot.com"
// };

firebase.initializeApp(config);

exports.getPhoneConfigs = function(req, res){
  var request = require('request');

  // Real Data:
  // 7873042704
  // @Snowman19
  var options = {
      url: 'https://selfcarepr.optivon.com/sip-ps/accession/login?DirectoryNumber='+req.body.phone+'&computerID=1eb3ee6fb5dfb557&platform=Accession&device=Android&deviceOS=7.1.1&ApplicationVersion=2.23.00&ApplicationID=MS_Android_Acc&Password='+req.body.password,
      headers: {
      'User-Agent': 'AM_MS_Android_Acc/2.23.00/Huawei/Nexus 6P/7.1.1/Accession Android CommPortal'
    }
  };
  function callback(error, response, body) {

      var parseString = require('xml2js').parseString;
      var xml = body;
      // parseString(xml, function (err, result) {
        // if(result.phoneConfig.network){
          // Testing purpose, while endpoint pack is not available
          var configs = {
            // "availability" : 0, DB
            // "companyId" : "-Kbkv5yVzzlBJV5Bz-8K",  DB
            "commPortalPassword" : req.body.password,
            "email" : req.body.email,
            "extension" : "2704", //NOC
            "firstName" : "Wilfredo",//junto con lastname NOC
            "lastName" : "Nieves", //Junto con firstname NOC
            "phone" : req.body.phone,
            // "picture" : "", DB
            "sipPassword" : "e+/gIbZ7QJkSMz8", //NOC
            "sipUsername" : "7873042704", //NOC
            // "status" : "Wop" DB
          }

          function checkCompanyId(){
            var companyId='';
            var companyName = "Optivon Inc."; //Replace with NOC credentials
            firebase.database().ref().child('companies').once('value', function(companiesSnapshot){
              var valuesArray = Object.values(companiesSnapshot.val());
              var keysArray = Object.keys(companiesSnapshot.val());
              var companyIndex;
              valuesArray.forEach(function(company, index){
                if (company.name === companyName){
                  companyIndex = index;
                }
              });
              companyId = keysArray[companyIndex];
              return companyId;
            });
          }

          function syncUpdates(user){

            firebase.database().ref().child('account').once('value', function(accountSnapshot){
              //Convert Not Iterable JSON to an array
        			var valuesArray = Object.values(accountSnapshot.val());
              var keysArray = Object.keys(accountSnapshot.val());
              var userIndex = keysArray.indexOf(user.uid);
              var newAccount = valuesArray[userIndex];

            });

            var contact ={
          		availability: newAccount.availability,
          		email: newAccount.email,
          		firstName: newAccount.firstName,
          		lastName: newAccount.lastName,
              name: newAccount.firstName+" "+newAccount.lastName,
          		phone: newAccount.phone,
          		picture: newAccount.picture,
          		status: newAccount.status,
          		extension: newAccount.extension,
          		companyId: newAccount.companyId,
          		userId: user.uid
          	}

          	firebase.database().ref("account").once("value", function (snap) {

          		var myBusinessGroupAccountKeys = [];

          		snap.forEach(function (childSnapshot) {
          			//if its not me and the account belongs to my company
          			if (childSnapshot.key != contact.userId && contact.companyId === childSnapshot.val().companyId) {
          				myBusinessGroupAccountKeys.push(childSnapshot.key);
          			}
          		})

          		myBusinessGroupAccountKeys.forEach(function(accountKey, index){
          			firebase.database().ref("user-contacts/"+accountKey)
          				.orderByChild("userId")
          				.equalTo(contact.userId)
          				.on("child_added", function(snapshot){
          					firebase.database().ref("user-contacts/"+accountKey+"/"+snapshot.key).set(contact);
          				})
          		})
              //Prepare and send response
              var responseObject = {
                "statusCode" : 200,
                "statusMessage": "Account created successfully.",
                "data":{
                  "email": req.body.email,
                  "password": req.body.password
                }
              }
              res.send(responseObject);
          	})
          }

          function syncEmailUpdate(user, oldAccount){

          	var contact ={
          		availability: oldAccount.availability,
          		email: configs.email,
          		firstName: configs.firstName,
          		lastName: configs.lastName,
              name: configs.firstName+" "+configs.lastName,
          		phone: configs.phone,
          		picture: oldAccount.picture,
          		status: oldAccount.status,
          		extension: configs.extension,
          		companyId: oldAccount.companyId,
          		userId: user.uid
          	}

          	firebase.database().ref("account").once("value", function (snap) {

          		var myBusinessGroupAccountKeys = [];

          		snap.forEach(function (childSnapshot) {
          			//if its not me and the account belongs to my company
          			if (childSnapshot.key != contact.userId && contact.companyId === childSnapshot.val().companyId) {
          				myBusinessGroupAccountKeys.push(childSnapshot.key);
          			}
          		})

          		myBusinessGroupAccountKeys.forEach(function(accountKey, index){
          			firebase.database().ref("user-contacts/"+accountKey)
          				.orderByChild("userId")
          				.equalTo(contact.userId)
          				.on("child_added", function(snapshot){
          					firebase.database().ref("user-contacts/"+accountKey+"/"+snapshot.key).set(contact);
          				})
          		})
              //Prepare and send response
              var responseObject = {
                "statusCode" : 200,
                "statusMessage": "Email updated successfully.",
                "data":{
                  "email": req.body.email,
                  "password": req.body.password
                }
              }
              res.send(responseObject);
          	})
          }

          function updateEmail(newEmail, oldAccount){
            firebase.auth().signOut().then(function() {
              if(firebase.auth().currentUser != null){
                firebase.auth().currentUseruser.updateEmail(newEmail).then(function() {
                  //Update changes
                  var updates = {};
                  updates['account/' + user.uid + '/email'] = newEmail;
                  firebase.database().ref().update(updates);
                  syncEmailUpdate(firebase.auth().currentUser, oldAccount);
                }, function(error) {
                  // An error happened.
                  var responseObject = {"statusCode" : 400, "statusMessage" : "Error updating email"}
                  res.send(responseObject);
                });
              }
              else{
                console.log("connecting with: "+oldAccount.email+" and "+oldAccount.commPortalPassword);
                firebase.auth().signInWithEmailAndPassword(oldAccount.email, oldAccount.commPortalPassword).then(function(user){
                  user.updateEmail(newEmail).then(function() {
                    //Update changes
                    var updates = {};
                    updates['account/' + user.uid + '/email'] = newEmail;
                    firebase.database().ref().update(updates);
                    syncEmailUpdate(user, oldAccount);
                  }, function(error) {
                    // An error happened.
                    var responseObject = {"statusCode" : 400, "statusMessage" : "Error updating email"}
                    res.send(responseObject);
                  });
                }).catch(function(error) {
              	  // Handle Errors here.
                  firebase.auth().signOut().then(function() {
                	}, function(error) {
                		console.error("\n\nerror signing out	\n\n");
                	});
              	  var errorCode = error.code;
              	  var errorMessage = error.message;
              	  if (errorCode === 'auth/wrong-password') {
              	    console.log("wrong-password");
              	  }
              		else {
              	    console.log(errorMessage);
              	  }
              	});
              }
            }, function(error) {
              console.error("\n\nerror signing out	\n\n");
            });
          }

          function replaceAccount(newEmail, newPassword){
            firebase.auth().signOut().then(function() {
              if(firebase.auth().currentUser != null){
                firebase.auth().currentUseruser.updateEmail(newEmail).then(function() {

                  // retrieve/create companyId
                  var companyId = checkCompanyId();

                  //Update changes
                  var updates = {};
                  updates['account/' + user.uid + '/email'] = newEmail;
                  updates['account/' + user.uid + '/availability'] = 0;
                  updates['account/' + user.uid + '/companyId'] = companyId;
                  updates['account/' + user.uid + '/commPortalPassword'] = configs.commPortalPassword;
                  updates['account/' + user.uid + '/extension'] = configs.extension;
                  updates['account/' + user.uid + '/firstName'] = configs.firstName;
                  updates['account/' + user.uid + '/lastName'] = configs.lastName;
                  updates['account/' + user.uid + '/picture'] = '';
                  updates['account/' + user.uid + '/sipPassword'] = configs.sipPassword;
                  updates['account/' + user.uid + '/sipUsername'] = configs.sipUsername;
                  updates['account/' + user.uid + '/status'] = 'Hi, I am using Mercury.';

                  firebase.database().ref().update(updates);

                  firebase.auth().currentUser.updatePassword(newPassword).then(function() {
                    // Update successful.
                    }, function(error) {
                    // An error happened.
                    });
                  syncUpdates(firebase.auth().currentUser);
                }, function(error) {
                  // An error happened.
                  var responseObject = {"statusCode" : 400, "statusMessage" : "Error updating email"}
                  res.send(responseObject);
                });
              }
              else{
                console.log("connecting with: "+oldAccount.email+" and "+oldAccount.commPortalPassword);
                firebase.auth().signInWithEmailAndPassword(oldAccount.email, oldAccount.commPortalPassword).then(function(user){
                  user.updateEmail(newEmail).then(function() {
                    // retrieve/create companyId
                    var companyId = checkCompanyId();

                    //Update changes
                    var updates = {};
                    updates['account/' + user.uid + '/email'] = newEmail;
                    updates['account/' + user.uid + '/availability'] = 0;
                    updates['account/' + user.uid + '/companyId'] = companyId;
                    updates['account/' + user.uid + '/commPortalPassword'] = configs.commPortalPassword;
                    updates['account/' + user.uid + '/extension'] = configs.extension;
                    updates['account/' + user.uid + '/firstName'] = configs.firstName;
                    updates['account/' + user.uid + '/lastName'] = configs.lastName;
                    updates['account/' + user.uid + '/picture'] = '';
                    updates['account/' + user.uid + '/sipPassword'] = configs.sipPassword;
                    updates['account/' + user.uid + '/sipUsername'] = configs.sipUsername;
                    updates['account/' + user.uid + '/status'] = 'Hi, I am using Mercury.';

                    firebase.database().ref().update(updates);

                    user.updatePassword(newPassword).then(function() {
                      // Update successful.
                      }, function(error) {
                      // An error happened.
                      });
                    syncUpdates(user);
                  }, function(error) {
                    // An error happened.
                    var responseObject = {"statusCode" : 400, "statusMessage" : "Error updating email"}
                    res.send(responseObject);
                  });
                }).catch(function(error) {
              	  // Handle Errors here.
                  firebase.auth().signOut().then(function() {
                	}, function(error) {
                		console.error("\n\nerror signing out	\n\n");
                	});
              	  var errorCode = error.code;
              	  var errorMessage = error.message;
              	  if (errorCode === 'auth/wrong-password') {
              	    console.log("wrong-password");
              	  }
              		else {
              	    console.log(errorMessage);
              	  }
              	});
              }
            }, function(error) {
              console.error("\n\nerror signing out	\n\n");
            });
          }

          function createNewAccount(account){
            console.log("new account")
          }

          firebase.database().ref().child('account').once('value', function(snapshot){
            //Convert Not Iterable JSON to an array
      			var array = Object.values(snapshot.val());
            var phoneExists = false;
            var accountWithSamePhone;
            //Improve complexity
            array.map(function(account){
              if(account.phone === configs.phone){
                phoneExists = true;
                accountWithSamePhone = account;
              }
            });
            if(phoneExists){
              console.log(accountWithSamePhone.email+" "+configs.email);
              console.log(accountWithSamePhone.commPortalPassword+" "+configs.commPortalPassword);
              if(accountWithSamePhone.email === configs.email && accountWithSamePhone.commPortalPassword === configs.commPortalPassword){
                var responseObject = {"statusCode" : 400, "statusMessage" : "Account is already registered"}
                res.send(responseObject);
              }
              else if(accountWithSamePhone.commPortalPassword === configs.commPortalPassword){
                updateEmail(configs.email, accountWithSamePhone);
              }
              else{
                //When a new user will inherit previous credentials
                replaceAccount(configs.email, configs.commPortalPassword);
              }
            }
            //Phone not exists
            else{
              createNewAccount(configs);
            }
          });
        // }
        // else{
        //   res.sendStatus(400);
        // }
      // });
  }
  // request(options, callback);
  http.post(options, callback);
  //change
}
