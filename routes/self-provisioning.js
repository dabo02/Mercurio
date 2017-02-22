exports.getPhoneConfigs = function(req, res){
  var request = require('request');
  var firebase = require('firebase');

  // Initialize Firebase

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
      parseString(xml, function (err, result) {
        if(result.phoneConfig.network){
          // Testing purpose, while endpoint pack is not available
          var configs = {
            "availability" : 0,
            "companyId" : "-Kbkv5yVzzlBJV5Bz-8K",
            "commPortalPassword" : "optivon_787",
            "email" : "figueroaisrael7@gmail.com",
            "extension" : "2703",
            "firstName" : "Israel",
            "lastName" : "Figueroa Fontanez AKA Ralo",
            "phone" : "7873042703",
            "picture" : "",
            "sipPassword" : "5JXsIE/x=AYy$yK",
            "sipUsername" : "7873042703",
            "status" : "Wop"
          }

          function syncEmailUpdate(user){

          	var contact ={
          		availability: configs.availability,
          		email: configs.email,
          		firstName: configs.firstName,
          		lastName: configs.lastName,
          		phone: configs.phone,
          		picture: configs.picture,
          		status: configs.status,
          		extension: configs.extension,
          		companyId: configs.companyId,
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
              var responseObject = {"statusCode" : 200, "statusMessage": "Email updated."}
              res.send(responseObject);
          	})
          }

          function updateEmail(newEmail, oldAccount){
            firebase.auth().signOut().then(function() {
              if(firebase.auth().currentUser != null){
                firebase.auth().currentUseruser.updateEmail(newEmail).then(function() {
                  var responseObject = {"statusCode" : 200, "statusMessage": "Email updated."}
                  res.send(responseObject);
                }, function(error) {
                  // An error happened.
                  var responseObject = {"statusCode" : 400, "statusMessage" : "Error updating email"}
                  res.send(responseObject);
                });
              }
              else{
                console.log("connectin with: "+oldAccount.email+" and "+oldAccount.commPortalPassword);
                firebase.auth().signInWithEmailAndPassword(oldAccount.email, oldAccount.commPortalPassword).then(function(user){
                  user.updateEmail(newEmail).then(function() {
                    //Update changes
                    var updates = {};
                    updates['account/' + user.uid + '/email'] = newEmail;
                    firebase.database().ref().update(updates);
                    syncEmailUpdate(user);
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

          function replaceAccount(account){

          }

          function createNewAccount(account){

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
                replaceAccount(configs);
              }
            }
            //Phone not exists
            else{
              createNewAccount(configs);
            }
          });
        }
        else{
          res.sendStatus(400);
        }
      });
  }
  request(options, callback);
}
