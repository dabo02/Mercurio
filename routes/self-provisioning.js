const CryptoJS = require("crypto-js");
var firebase = require('firebase');
// Initialize Firebase
var http = require('http-request');
// Development configs
// var config = {
//   apiKey: "AIzaSyAlTNQ0rX_z49-EL71e8le0vPew16g8WDg",
//   authDomain: "mercurio-development.firebaseapp.com",
//   databaseURL: "https://mercurio-development.firebaseio.com",
//   storageBucket: "mercurio-development.appspot.com",
//   messagingSenderId: "203647142462"
// };

//Production configs
var config = {
  apiKey: "AIzaSyBYty0ff3hxlmwmBjy7paWCEalIrJxDpZ8",
  authDomain: "mercurio-39a44.firebaseapp.com",
  databaseURL: "https://mercurio-39a44.firebaseio.com",
  storageBucket: "mercurio-39a44.appspot.com"
};

firebase.initializeApp(config);

exports.authenticate = function(req, res){
  var request = require('request');

  // Real Data:
  // 7873042704
  // @Snowman19
  var options = {
      url: 'https://selfcarepr.optivon.com/sip-ps/mercurio/config?DirectoryNumber='+req.body.phone+'&Password='+req.body.password,
      headers: {
      'User-Agent': 'Mercurio'
    }
  };
  function callback(error, data) {
      var parseString = require('xml2js').parseString;
      var stringArray = (data.buffer.toString().split('\n'));


        if(data.buffer){

        //Parsing data
        var result={
          "phoneConfig":{
            "network":[
              {
                "sipPassword" :[],
                "firstName" :[],
                "lastName" :[],
                "companyName" :[],
                "extension": []
              }
            ]
          }
        }
        stringArray.map(function(string){
          if(string.search("DISPLAY_NAME")>-1){
            var startIndex = string.search("=")+2;
            var fullName = string.substring(startIndex)
            result.phoneConfig.network[0].firstName.push(fullName.substring(0,fullName.indexOf(' ')));
            result.phoneConfig.network[0].lastName.push(fullName.substring(fullName.indexOf(' ')+1, fullName.indexOf('"')));
          }
          else if(string.search("BG_NAME")>-1){
            var startIndex = string.search("=")+2;
            var company = string.substring(startIndex)
            result.phoneConfig.network[0].companyName.push(company.substring(0, company.indexOf('"')));
          }
          else if(string.search("SIP_PASS")>-1){
            var startIndex = string.search("=")+2;
            var password = string.substring(startIndex)
            result.phoneConfig.network[0].sipPassword.push(password.substring(0, password.indexOf('"')));
          }
          else if(string.search("EXTENSION")>-1){
            var startIndex = string.search("=")+2;
            var ext = string.substring(startIndex)
            result.phoneConfig.network[0].extension.push(ext.substring(0, ext.indexOf('"')));
          }
        });

          var configs = {
            // "availability" : 0, DB
            // "companyId" : "-Kbkv5yVzzlBJV5Bz-8K",  DB
            "commPortalPassword" : req.body.password,
            "email" : req.body.email,
            "extension" : result.phoneConfig.network[0].extension[0], //NOC
            "firstName" : result.phoneConfig.network[0].firstName[0],//junto con lastname NOC
            "lastName" : result.phoneConfig.network[0].lastName[0], //Junto con firstname NOC
            "phone" : req.body.phone,
            // "picture" : "", DB
            "sipPassword" : result.phoneConfig.network[0].sipPassword[0], //NOC
            "sipUsername" : req.body.phone,
            // "status" : "Wop" DB
          }
          // console.log(configs)
          firebase.database().ref().child('account').once('value', function(snapshot){
            //Convert Not Iterable JSON to an array
	          var keysArray = Object.keys(snapshot.val());
	          var valuesArray = [];
	          keysArray.map(function(key){
		          valuesArray.push(snapshot.val()[key]);
	          })
	          var array = valuesArray.slice();
            var phoneExists = false;
            var previousAccount;

            //Improve complexity
            array.map(function(account){
              if(account.phone === configs.phone){
                phoneExists = true;
                previousAccount = account;
              }
            });
            if(phoneExists){
              console.log(previousAccount.email+" "+configs.email);
              if(previousAccount.email === configs.email && decrypt(previousAccount.commPortalPassword) === configs.commPortalPassword){
                var responseObject = {"statusCode" : 400, "statusMessage" : "Account is already registered"}
                res.send(responseObject);

              }
              else if(decrypt(previousAccount.commPortalPassword) === configs.commPortalPassword){
                // updateEmail(configs.email, previousAccount);
                var responseObject = {
                  "statusCode" : 200,
                  "route" : "updateEmail",
                  "newEmail" : configs.email,
                  "previousAccount": previousAccount
                 }
                 res.send(responseObject);
              }
              else{
                //When a new user will inherit previous credentials
                var responseObject = {
                  "statusCode" : 200,
                  "route" : "replaceAccount",
                  "newEmail" : configs.email,
                  "newPassword": encrypt(configs.commPortalPassword),
                  "previousAccount": previousAccount,
                  "newAccount" : {
                    "availability" : 0,
                    "companyId" : '',
                    "commPortalPassword" : encrypt(configs.commPortalPassword),
                    "email" : configs.email,
                    "extension" : configs.extension, //NOC
                    "firstName" : configs.firstName,//junto con lastname NOC
                    "lastName" : configs.lastName, //Junto con firstname NOC
                    "phone" : configs.phone,
                    "picture" : "",
                    "sipPassword" : configs.sipPassword, //NOC
                    "sipUsername" : configs.sipUsername, //NOC
                    "status" : "Hey I'm using Mercury"
                  },
                  "companyName":result.phoneConfig.network[0].companyName[0]
                 }
                 res.send(responseObject);
              }
            }
            //Phone not exists
            else{
              var responseObject = {
                "statusCode" : 200,
                "route" : "register",
                "newAccount": {
                  "availability" : 0,
                  "companyId" : '',
                  "commPortalPassword" : encrypt(configs.commPortalPassword),
                  "email" : configs.email,
                  "extension" : configs.extension, //NOC
                  "firstName" : configs.firstName,//junto con lastname NOC
                  "lastName" : configs.lastName, //Junto con firstname NOC
                  "phone" : configs.phone,
                  "picture" : "",
                  "sipPassword" : configs.sipPassword, //NOC
                  "sipUsername" : configs.sipUsername, //NOC
                  "status" : "Hey I'm using Mercury"
                },
                "companyName":result.phoneConfig.network[0].companyName[0]
               }
               res.send(responseObject);
            }
          });
        }
        else{
          var responseObject = {
            "statusCode":400,
            "statusMessage":"There are no records corresponding to your credentials."
          }
          res.send(responseObject);
        }

  }
  // request(options, callback);
  http.get(options, callback);
  //change this
}

exports.updateEmail = function(req, res){

  function syncEmailUpdate(user, oldAccount){

    var contact ={
      availability: oldAccount.availability,
      email: req.body.newEmail,
      firstName: oldAccount.firstName,
      lastName: oldAccount.lastName,
      name: oldAccount.firstName+" "+oldAccount.lastName,
      phone: oldAccount.phone,
      picture: oldAccount.picture,
      status: oldAccount.status,
      extension: oldAccount.extension,
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
        "statusMessage": "Email updated successfully."
      }
      res.send(responseObject);
    })
  }

  function updateEmail(newEmail, oldAccount){
    console.log("updating email...")
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
        firebase.auth().signInWithEmailAndPassword(oldAccount.email, decrypt(oldAccount.commPortalPassword)).then(function(user){
          user.updateEmail(newEmail).then(function() {
            //Update changes
            var updates = {};
            updates['account/' + user.uid + '/email'] = newEmail;
            firebase.database().ref().update(updates);
            syncEmailUpdate(user, oldAccount);
          }, function(error) {
            // An error happened.
            var responseObject = {"statusCode" : 400, "statusMessage" : "Error updating email", "firebaseError": error}
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
          var responseObject = {"statusCode" : 400, "statusMessage" : "Error signing in with this email"}
          res.send(responseObject);
        });
      }
    }, function(error) {
      console.error("\n\nerror signing out	\n\n");
    });
  }
  console.log("before updating email")
  updateEmail(req.body.newEmail, req.body.previousAccount);

}

exports.replaceAccount = function(req, res){
  var configs = req.body.previousAccount;
  // function createNewCompany(companyName, newEmail, user){
  //   //Push company name to firebase DB
  //   var postData = {
  //     "name": companyName
  //   };
  //   // Get a key for a new Post.
  //   var newPostKey = firebase.database().ref().child('companies').push().key;
  //
  //   var updates = {};
  //   updates['/companies/' + newPostKey] = postData;
  //   // firebase.database().ref().update(updates);
  //   //
  //   //Update changes
  //   updates['account/' + user.uid + '/email'] = newEmail;
  //   updates['account/' + user.uid + '/availability'] = 0;
  //   updates['account/' + user.uid + '/companyId'] = newPostKey;
  //   updates['account/' + user.uid + '/commPortalPassword'] = configs.commPortalPassword;
  //   updates['account/' + user.uid + '/extension'] = configs.extension;
  //   updates['account/' + user.uid + '/firstName'] = configs.firstName;
  //   updates['account/' + user.uid + '/lastName'] = configs.lastName;
  //   updates['account/' + user.uid + '/picture'] = '';
  //   updates['account/' + user.uid + '/sipPassword'] = configs.sipPassword;
  //   updates['account/' + user.uid + '/sipUsername'] = configs.sipUsername;
  //   updates['account/' + user.uid + '/status'] = 'Hi, I am using Mercury.';
  //
  //   firebase.database().ref().update(updates).then(function(){
  //     syncUpdates(user);
  //   });
  //
  //   //
  // }

  // function setCompanyId(newEmail, user){
  //   var companyId='';
  //   var companyName = "Optivon, Inc."; //Replace with NOC credentials
  //   firebase.database().ref().child('companies').once('value', function(companiesSnapshot){
  //     var keysArray = Object.keys(companiesSnapshot.val());
  //     var valuesArray = [];
  //     keysArray.map(function(key){
  //       valuesArray.push(companiesSnapshot.val()[key]);
  //     })
  //
  //     valuesArray.forEach(function(company, index){
  //       if (company.name === companyName){
  //         companyId = keysArray[index];
  //       }
  //     });
  //     if(companyId.length>0){
  //       //Update changes
  //       var updates = {};
  //       updates['account/' + user.uid + '/email'] = newEmail;
  //       updates['account/' + user.uid + '/availability'] = 0;
  //       updates['account/' + user.uid + '/companyId'] = companyId;
  //       updates['account/' + user.uid + '/commPortalPassword'] = configs.commPortalPassword;
  //       updates['account/' + user.uid + '/extension'] = configs.extension;
  //       updates['account/' + user.uid + '/firstName'] = configs.firstName;
  //       updates['account/' + user.uid + '/lastName'] = configs.lastName;
  //       updates['account/' + user.uid + '/picture'] = '';
  //       updates['account/' + user.uid + '/sipPassword'] = configs.sipPassword;
  //       updates['account/' + user.uid + '/sipUsername'] = configs.sipUsername;
  //       updates['account/' + user.uid + '/status'] = 'Hi, I am using Mercury.';
  //
  //       firebase.database().ref().update(updates).then(function(){
  //         syncUpdates(user);
  //       });
  //     }
  //     else{
  //       createNewCompany(companyName, newEmail, user);
  //     }
  //   });
  // }

  // function syncUpdates(user){
  //
  //   firebase.database().ref().child('account').once('value', function(accountSnapshot){
  //     //Convert Not Iterable JSON to an array
  //     var keysArray = Object.keys(accountSnapshot.val());
  //     var valuesArray = [];
  //     keysArray.map(function(key){
  //       valuesArray.push(accountSnapshot.val()[key]);
  //     })
  //     var userIndex = keysArray.indexOf(user.uid);
  //     var newAccount = valuesArray[userIndex];
  //     var contact ={
  //       availability: newAccount.availability,
  //       email: newAccount.email,
  //       firstName: newAccount.firstName,
  //       lastName: newAccount.lastName,
  //       name: newAccount.firstName+" "+newAccount.lastName,
  //       phone: newAccount.phone,
  //       picture: newAccount.picture,
  //       status: newAccount.status,
  //       extension: newAccount.extension,
  //       companyId: newAccount.companyId,
  //       userId: user.uid
  //     }
  //
  //     firebase.database().ref("account").once("value", function (snap) {
  //
  //       var myBusinessGroupAccountKeys = [];
  //
  //       snap.forEach(function (childSnapshot) {
  //         //if its not me and the account belongs to my company
  //         if (childSnapshot.key != contact.userId && contact.companyId === childSnapshot.val().companyId) {
  //           myBusinessGroupAccountKeys.push(childSnapshot.key);
  //         }
  //       })
  //
  //       myBusinessGroupAccountKeys.forEach(function(accountKey, index){
  //         firebase.database().ref("user-contacts/"+accountKey)
  //           .orderByChild("userId")
  //           .equalTo(contact.userId)
  //           .on("child_added", function(snapshot){
  //             firebase.database().ref("user-contacts/"+accountKey+"/"+snapshot.key).set(contact);
  //           })
  //       })
  //       //Prepare and send response
  //       var responseObject = {
  //         "statusCode" : 200,
  //         "statusMessage": "Account created successfully."
  //       }
  //       res.send(responseObject);
  //     })
  //   });
  //
  //
  // }

  function replaceAccount(newEmail, newPassword, oldAccount){

    //
    function contactsScript(contact){
      firebase.database().ref("account").once("value", function (snap) {

        var myBusinessGroupAccountKeys = [];
        var myBusinessGroupAccountValues = [];
        snap.forEach(function (childSnapshot) {
          //if its not me and the account belongs to my company
          if (childSnapshot.key != contact.userId && contact.companyId === childSnapshot.val().companyId) {
            myBusinessGroupAccountKeys.push(childSnapshot.key);
            myBusinessGroupAccountValues.push(childSnapshot.val());
          }
        })
        console.log("values: "+myBusinessGroupAccountValues);
        var updates = {};
        myBusinessGroupAccountKeys.forEach(function(accountKey, index){
          firebase.database().ref("user-contacts/"+accountKey)
            .orderByChild("userId")
            .equalTo(contact.userId)
            .once("value", function(snapshot){
              // Get a key for a new Post.
              var newContactKey = firebase.database().ref().child('user-contacts/'+accountKey).push().key;
              var myKey = firebase.database().ref().child('user-contacts/'+contact.userId).push().key;

              var newAccount = myBusinessGroupAccountValues[index];

              var otherContact ={
                availability: newAccount.availability,
                email: newAccount.email,
                firstName: newAccount.firstName,
                lastName: newAccount.lastName,
                phone: newAccount.phone,
                picture: newAccount.picture,
                status: newAccount.status,
                extension: newAccount.extension,
                companyId: newAccount.companyId,
                userId: accountKey
              }

              updates["user-contacts/"+accountKey+"/"+myKey] = contact;
              updates["user-contacts/"+contact.userId+"/"+newContactKey] = otherContact;

              if(index==myBusinessGroupAccountKeys.length-1){
                firebase.database().ref().update(updates).then(function(){
                  //Prepare and send response
                  var responseObject = {
                    "statusCode" : 200,
                    "statusMessage": "Account created successfully."
                  }
                  res.send(responseObject);
                });
              }

            });
        });

      })
    }

    function syncUpdates(user){

      firebase.database().ref().child('account').once('value', function(accountSnapshot){
        //Convert Not Iterable JSON to an array
        var keysArray = Object.keys(accountSnapshot.val());
        var valuesArray = [];
        keysArray.map(function(key){
          valuesArray.push(accountSnapshot.val()[key]);
        })
        var userIndex = keysArray.indexOf(user.uid);
        var newAccount = valuesArray[userIndex];
        var contact ={
          availability: newAccount.availability,
          email: newAccount.email,
          firstName: newAccount.firstName,
          lastName: newAccount.lastName,
          phone: newAccount.phone,
          picture: newAccount.picture,
          status: newAccount.status,
          extension: newAccount.extension,
          companyId: newAccount.companyId,
          userId: user.uid
        }

        // firebase.database().ref("account").once("value", function (snap) {
        //
        //   var myBusinessGroupAccountKeys = [];
        //
        //   snap.forEach(function (childSnapshot) {
        //     //if its not me and the account belongs to my company
        //     if (childSnapshot.key != contact.userId && contact.companyId === childSnapshot.val().companyId) {
        //       myBusinessGroupAccountKeys.push(childSnapshot.key);
        //     }
        //   })
        //
        //   myBusinessGroupAccountKeys.forEach(function(accountKey, index){
        //     firebase.database().ref("user-contacts/"+accountKey)
        //       .orderByChild("userId")
        //       .equalTo(contact.userId)
        //       .on("child_added", function(snapshot){
        //         firebase.database().ref("user-contacts/"+accountKey+"/"+snapshot.key).set(contact);
        //       })
        //   })
        //   //Prepare and send response
        //   var responseObject = {
        //     "statusCode" : 200,
        //     "statusMessage": "Account created successfully."
        //   }
        //   res.send(responseObject);
        // })
        contactsScript(contact);
      });


    }


    function createNewAccount(newAccount){

      //Set comany ID
      var companyId='';
      var companyName = req.body.newAccount.companyName; //Replace with NOC credentials
      firebase.database().ref().child('companies').once('value', function(companiesSnapshot){
        var keysArray = Object.keys(companiesSnapshot.val());
        var valuesArray = [];
        keysArray.map(function(key){
          valuesArray.push(companiesSnapshot.val()[key]);
        })
        valuesArray.forEach(function(company, index){
          if (company.name === companyName){
            companyId = keysArray[index];
          }
        });
        if(companyId.length==0){
          var companyData = {
            "name": companyName
          };
          // Get a key for a new Post.
          var newPostKey = firebase.database().ref().child('companies').push().key;

          var updates = {};
          updates['/companies/' + newPostKey] = companyData;
          firebase.database().ref().update(updates)
          companyId = newPostKey;
        }
        var accountData = newAccount;
        accountData.companyId = companyId;

        // var updates = {};


        firebase.auth().createUserWithEmailAndPassword(accountData.email, accountData.commPortalPassword).then(function(user){
          var updates = {};
          updates['account/' + user.uid] = accountData;
          // updates['account/' + user.uid + '/email'] = accountData.email;
          // updates['account/' + user.uid + '/availability'] = accountData.availability;
          // updates['account/' + user.uid + '/companyId'] = accountData.companyId;
          // updates['account/' + user.uid + '/commPortalPassword'] = accountData.commPortalPassword;
          // updates['account/' + user.uid + '/extension'] = accountData.extension;
          // updates['account/' + user.uid + '/firstName'] = accountData.firstName;
          // updates['account/' + user.uid + '/lastName'] = accountData.lastName;
          // updates['account/' + user.uid + '/picture'] = accountData.picture;
          // updates['account/' + user.uid + '/sipPassword'] = accountData.sipPassword;
          // updates['account/' + user.uid + '/sipUsername'] = accountData.sipUsername;
          // updates['account/' + user.uid + '/status'] = accountData.status;
          console.log(updates);
          firebase.database().ref().update(updates).then(function(){
            syncUpdates(user);
          });
        }).catch(function(error){
          var responseObject = {
            "statusCode" : 400,
            "statusMessage" : "Email already in use"
          }
          res.send(responseObject);
        });

      })


    }
    //

    firebase.auth().signOut().then(function() {
      if(firebase.auth().currentUser != null){
    //     firebase.auth().currentUser.updateEmail(newEmail).then(function() {
    //       // retrieve/create companyId
    //       var companyId = setCompanyId(newEmail, firebase.auth().currentUser);
    //
    //       user.updatePassword(newPassword).then(function() {
    //         // Update successful.
    //         }, function(error) {
    //         // An error happened.
    //         });
    //
    //     }, function(error) {
    //       // An error happened.
    //       var responseObject = {"statusCode" : 400, "statusMessage" : "Error updating email"}
    //       res.send(responseObject);
    //     });
      }
      else{
        firebase.auth().signInWithEmailAndPassword(oldAccount.email, oldAccount.commPortalPassword).then(function(user){
    //       user.updateEmail(newEmail).then(function() {
    //         // retrieve/create companyId
    //         var companyId = setCompanyId(newEmail, user);
    //
    //         user.updatePassword(newPassword).then(function() {
    //           // Update successful.
    //           }, function(error) {
    //           // An error happened.
    //           });
    //
    //       }, function(error) {
    //         // An error happened.
    //         var responseObject = {"statusCode" : 400, "statusMessage" : "Error updating email"}
    //         res.send(responseObject);
    //       });

            firebase.database().ref().child('account').once('value', function(accountSnapshot){
              //Convert Not Iterable JSON to an array
              var keysArray = Object.keys(accountSnapshot.val());
              var valuesArray = [];
              keysArray.map(function(key){
                valuesArray.push(accountSnapshot.val()[key]);
              })
              var userIndex = keysArray.indexOf(user.uid);
              var previousAccount = valuesArray[userIndex];
              var contact ={
                availability: 0,
                email: newEmail,
                commPortalPassword : newPassword,
                firstName: 'New',
                lastName: 'Account',
                phone: previousAccount.phone,
                picture: '',
                status: "Hey I'm using Mercury",
                extension: previousAccount.extension,
                sipPassword: previousAccount.sipPassword,
                sipUsername: previousAccount.sipUsername,
                companyId: previousAccount.companyId
              }
              var updates={};
              updates['account/' + user.uid + '/isDeleted'] = true;
              firebase.database().ref().update(updates).then(function(){
                user.delete().then(function(){
                  createNewAccount(contact);
                }, function(error){
                  console.log("cannot delete user")
                });
              });
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
            console.log("error: "+errorMessage);
          }
        });
      }
    }, function(error) {
      console.error("\n\nerror signing out	\n\n");
    });
  }
  replaceAccount(req.body.newEmail, req.body.newPassword, req.body.previousAccount);
}

exports.createNewAccount = function(req, res){

  function contactsScript(contact){
    firebase.database().ref("account").once("value", function (snap) {

      var myBusinessGroupAccountKeys = [];
      var myBusinessGroupAccountValues = [];
      snap.forEach(function (childSnapshot) {
        //if its not me and the account belongs to my company
        if (childSnapshot.key != contact.userId && contact.companyId === childSnapshot.val().companyId) {
          myBusinessGroupAccountKeys.push(childSnapshot.key);
          myBusinessGroupAccountValues.push(childSnapshot.val());
        }
      })
      console.log("values: "+myBusinessGroupAccountValues);
      var updates = {};
      myBusinessGroupAccountKeys.forEach(function(accountKey, index){
        firebase.database().ref("user-contacts/"+accountKey)
          .orderByChild("userId")
          .equalTo(contact.userId)
          .once("value", function(snapshot){
            // Get a key for a new Post.
            var newContactKey = firebase.database().ref().child('user-contacts/'+accountKey).push().key;
            var myKey = firebase.database().ref().child('user-contacts/'+contact.userId).push().key;

            var newAccount = myBusinessGroupAccountValues[index];

            var otherContact ={
              availability: newAccount.availability,
              email: newAccount.email,
              firstName: newAccount.firstName,
              lastName: newAccount.lastName,
              phone: newAccount.phone,
              picture: newAccount.picture,
              status: newAccount.status,
              extension: newAccount.extension,
              companyId: newAccount.companyId,
              userId: accountKey
            }

            updates["user-contacts/"+accountKey+"/"+myKey] = contact;
            updates["user-contacts/"+contact.userId+"/"+newContactKey] = otherContact;

            if(index==myBusinessGroupAccountKeys.length-1){
              firebase.database().ref().update(updates).then(function(){
                //Prepare and send response
                var responseObject = {
                  "statusCode" : 200,
                  "statusMessage": "Account created successfully."
                }
                res.send(responseObject);
              });
            }

          });
      });

    })
  }

  function syncUpdates(user){

    firebase.database().ref().child('account').once('value', function(accountSnapshot){
      //Convert Not Iterable JSON to an array
      var keysArray = Object.keys(accountSnapshot.val());
      var valuesArray = [];
      keysArray.map(function(key){
        valuesArray.push(accountSnapshot.val()[key]);
      })
      var userIndex = keysArray.indexOf(user.uid);
      var newAccount = valuesArray[userIndex];
      var contact ={
        availability: newAccount.availability,
        email: newAccount.email,
        firstName: newAccount.firstName,
        lastName: newAccount.lastName,
        phone: newAccount.phone,
        picture: newAccount.picture,
        status: newAccount.status,
        extension: newAccount.extension,
        companyId: newAccount.companyId,
        userId: user.uid
      }

      // firebase.database().ref("account").once("value", function (snap) {
      //
      //   var myBusinessGroupAccountKeys = [];
      //
      //   snap.forEach(function (childSnapshot) {
      //     //if its not me and the account belongs to my company
      //     if (childSnapshot.key != contact.userId && contact.companyId === childSnapshot.val().companyId) {
      //       myBusinessGroupAccountKeys.push(childSnapshot.key);
      //     }
      //   })
      //
      //   myBusinessGroupAccountKeys.forEach(function(accountKey, index){
      //     firebase.database().ref("user-contacts/"+accountKey)
      //       .orderByChild("userId")
      //       .equalTo(contact.userId)
      //       .on("child_added", function(snapshot){
      //         firebase.database().ref("user-contacts/"+accountKey+"/"+snapshot.key).set(contact);
      //       })
      //   })
      //   //Prepare and send response
      //   var responseObject = {
      //     "statusCode" : 200,
      //     "statusMessage": "Account created successfully."
      //   }
      //   res.send(responseObject);
      // })
      contactsScript(contact);
    });


  }


  function createNewAccount(){
    console.log("Enter create new account")
    //Set comany ID
    var companyId='';
    var companyName = req.body.newAccount.companyName; //Replace with NOC credentials
    firebase.database().ref().child('companies').once('value', function(companiesSnapshot){
      console.log("in db")
      var keysArray = Object.keys(companiesSnapshot.val());
      var valuesArray = [];
      keysArray.map(function(key){
        valuesArray.push(companiesSnapshot.val()[key]);
      })
      valuesArray.forEach(function(company, index){
        if (company.name === companyName){
          companyId = keysArray[index];
        }
      });
      if(companyId.length==0){
        var companyData = {
          "name": companyName
        };
        // Get a key for a new Post.
        var newPostKey = firebase.database().ref().child('companies').push().key;

        var updates = {};
        updates['/companies/' + newPostKey] = companyData;
        firebase.database().ref().update(updates)
        companyId = newPostKey;
      }
      var accountData = req.body.newAccount;
      accountData.companyId = companyId;

      // var updates = {};
      console.log("Creating auth...")

      firebase.auth().createUserWithEmailAndPassword(accountData.email, decrypt(accountData.commPortalPassword)).then(function(user){
        var updates = {};
        updates['account/' + user.uid] = accountData;
        // updates['account/' + user.uid + '/email'] = accountData.email;
        // updates['account/' + user.uid + '/availability'] = accountData.availability;
        // updates['account/' + user.uid + '/companyId'] = accountData.companyId;
        // updates['account/' + user.uid + '/commPortalPassword'] = accountData.commPortalPassword;
        // updates['account/' + user.uid + '/extension'] = accountData.extension;
        // updates['account/' + user.uid + '/firstName'] = accountData.firstName;
        // updates['account/' + user.uid + '/lastName'] = accountData.lastName;
        // updates['account/' + user.uid + '/picture'] = accountData.picture;
        // updates['account/' + user.uid + '/sipPassword'] = accountData.sipPassword;
        // updates['account/' + user.uid + '/sipUsername'] = accountData.sipUsername;
        // updates['account/' + user.uid + '/status'] = accountData.status;
        console.log(updates);
        firebase.database().ref().update(updates).then(function(){
          syncUpdates(user);
        });
      }).catch(function(error){
        var responseObject = {
          "statusCode" : 400,
          "statusMessage" : "Email already in use or password too short"
        }
        res.send(responseObject);
      });

    })


  }

  createNewAccount();
}


function encrypt(text){
  return CryptoJS.AES.encrypt(text, 'QA&\0TnU').toString();
}

function decrypt(text, key){
  return CryptoJS.AES.decrypt(text, 'QA&\0TnU').toString(CryptoJS.enc.Utf8);
}
