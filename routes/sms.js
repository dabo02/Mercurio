var request = require('request');
var firebase = require('firebase');
// Initialize Firebase
// Development configs
// var config = {
//   apiKey: "AIzaSyAlTNQ0rX_z49-EL71e8le0vPew16g8WDg",
//   authDomain: "mercurio-development.firebaseapp.com",
//   databaseURL: "https://mercurio-development.firebaseio.com",
//   storageBucket: "mercurio-development.appspot.com",
//   messagingSenderId: "203647142462"
// };

//Production configs
// var config = {
//   apiKey: "AIzaSyBYty0ff3hxlmwmBjy7paWCEalIrJxDpZ8",
//   authDomain: "mercurio-39a44.firebaseapp.com",
//   databaseURL: "https://mercurio-39a44.firebaseio.com",
//   storageBucket: "mercurio-39a44.appspot.com"
// };

// firebase.initializeApp(config);

exports.send = function(req,res){

    var data = req.body;

      var options = {
        method: 'POST',
          url: 'https://api.layered.com/messaging/sms/send?sessionId=441139e041f04f15910a6de30f964b9aY2F0cw78cab7d318bd4aec9000e244e0e9c8ea',
          headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      };

      function callback(error, data){
        if(error == null){
          res.send(error);
        }
        else{
          res.send(JSON.stringify(data.body));
        }
      }
      request(options, callback);
}

exports.receive = function(req,res){
  //
  /*
  Sends a chat message to server
  @method
  @params: chatIndex - index of the recent chat to which the send message belongs to
  		 message - AbstractMessage object
  */
  var from = req.body.from;
  var to = req.body.to;
  var textMessage = req.body.text;
  var chat;
  var chatExists = false;
  var chatKey;

  firebase.database().ref().child('chat-members').once('value', function(membersSnapshot){
    firebase.database().ref().child('account').once('value', function(accountSnapshot){
      var keysArray = Object.keys(accountSnapshot.val());
      var mercurioUser={};
      keysArray.map(function(key){
        if(accountSnapshot.val()[key].phone==to){
          mercurioUser.userId = key;
          mercurioUser.firstName = accountSnapshot.val()[key].firstName;
        }
      });
      var keysArray = Object.keys(membersSnapshot.val());
      keysArray.map(function(key){
        var members = Object.keys(membersSnapshot.val()[key])
        if(members.indexOf(from)>-1 && members.indexOf(mercurioUser.userId)>-1){
          chatKey = key;
          chatExists = true;
        }
      });
      if(chatExists){
        firebase.database().ref().child('user-chats').once('value', function(chatSnapshot){
          chat = chatSnapshot.val()[mercurioUser.userId][chatKey];
          var message = {
            "from" : from,
            "multimediaUrl" : "",
            "textContent" : textMessage,
            "timeStamp" : Date.now(),
            "type" : "im"
          }
          var feedback = "Guardar "+JSON.stringify(message)+"en este chat --> "+JSON.stringify(chat);
          // res.send(feedback);
          sendMultimediaMessage(chat,message, mercurioUser)
        })
      }
      else{
        var message = {
          "from" : from,
          "multimediaUrl" : "",
          "textContent" : textMessage,
          "timeStamp" : Date.now(),
          "type" : "im"
        }
        var feedback = "Crear chat con "+mercurioUser.firstName+",con este mensaje "+JSON.stringify(message);
        // res.send(feedback);
        createChat(message, mercurioUser);
      }
    });
  });

  function addMessage(message, key){
    var newMessageKey = firebase.database().ref().child('chat-messages/' + key).push().key;

  	//determine if contact number belongs to a mercurio user and if so find that user's id
  	//before updating the new contact's attributes in firebase

  	var updates = {};
    message.messageId = newMessageKey;
  	updates['/chat-messages/' + key + "/" + newMessageKey] = message;
  	firebase.database().ref().update(updates);

  	return newMessageKey;
  }

  function sendMultimediaMessage(chat, message, mercurioUser){

  	var self = this;

  	// if(!message.multimediaUrl){
  	// 	message.multimediaUrl = "";
  	// }
    console.log(JSON.stringify(mercurioUser));
  	var newMessageKey = addMessage(message, chatKey);
  	firebase.database().ref().child('message-info/' + newMessageKey + "/read/" + mercurioUser.userId).set(0);
    firebase.database().ref().child('message-info/' + newMessageKey + "/has-message/" + mercurioUser.userId).set(true);
  	// if(message.multimediaUrl){
  	// 	var uploadTask = firebase.storage().ref().child('chats/' + chat.chatId + '/images/' + newMessageKey).put(message.multimediaUrl);
    //
  	// 	//
  	// 	// Listen for state changes, errors, and completion of the upload.
    //       uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
    //         function(snapshot) {
  	// 					self.uploadingImage = true;
    //           // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    //           var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //           switch (snapshot.state) {
    //             case firebase.storage.TaskState.PAUSED: // or 'paused'
    //               break;
    //             case firebase.storage.TaskState.RUNNING: // or 'running'
    //               break;
    //           }
    //         }, function(error) {
  	// 					self.uploading = false;
    //         switch (error.code) {
    //           case 'storage/unauthorized':
    //             // User doesn't have permission to access the object
    //             break;
    //
    //           case 'storage/canceled':
    //             // User canceled the upload
    //             break;
    //
    //           case 'storage/unknown':
    //             // Unknown error occurred, inspect error.serverResponse
    //             break;
    //         }
    //       }, function() {
    //         // Upload completed successfully, now we can get the download URL
  	// 				message.multimediaUrl = uploadTask.snapshot.downloadURL;
    //
  	// 				var updates = {};
  	// 				updates['/chat-messages/' + chat.chatId + "/" + newMessageKey + "/multimediaUrl"] = message.multimediaUrl;
    //
  	// 				firebase.database().ref().update(updates);
    //
  	// 				sendTextMessage(chat, newMessageKey, message);
    //
    //       });
  	// }
  	// else{
    //
  	// 	sendTextMessage(chat, newMessageKey, message);
  	// }
    sendTextMessage(chat, newMessageKey, message, mercurioUser);
  }

  function sendTextMessage(chat, newMessageKey, message, mercurioUser){

  	var self = this;
  	function sendPushNotification(pushToken){
  		var tokenArray = [];

			//Convert Not Iterable JSON to an array
      if(pushToken==null){
        console.log("No tokens")
      }
      else{
        var array = Object.keys(pushToken);
  			tokenArray = array.slice();
      }

  		if(tokenArray.length>0){
        //
        //send push notification
        var FCM = require('fcm-push');

        //Development Key
         var serverkey = 'AIzaSyAlTNQ0rX_z49-EL71e8le0vPew16g8WDg';

        //Production Key
        //var serverkey = 'AIzaSyBYty0ff3hxlmwmBjy7paWCEalIrJxDpZ8';

        var fcm = new FCM(serverkey);

        for(var i = 0; i < tokenArray.length; i++){
          var token = tokenArray[i];
          var bodyMessage = textMessage;
          var message =  {
                to : token,
                priority:'high',
                notification : {
                  title : from,
                  body : bodyMessage,
                  sound : true
                }
          };

          fcm.send(message, function(err,response){
            if(err) {
              console.error(err);
            }
          });
        }
      }
  	}

      var participant = mercurioUser;

  		firebase.database().ref().child('user-tokens/'+participant.userId).once('value', function(snapshot){

  			firebase.database().ref().child("user-chats").child(participant.userId).child(chatKey)
  			.once('value', function(actualChat){
  				if(!actualChat.val().settings.mute){
  					sendPushNotification(snapshot.val());
  				}
  			});
  		});

  		var updates = {};
  		message.messageId = newMessageKey;

  		updates['/user-chats/' + participant.userId + "/" + chatKey + "/lastMessage"] = message;

  		firebase.database().ref().update(updates);
      console.log("done");
      res.sendStatus(200);
  	// var chat = self.chatList[chatIndex];
  // 	self.chatList.splice(chatIndex, 1);
  // 	self.chatList.unshift(chat);
  }

  function createChat(message, mercurioUser){
    var key = firebase.database().ref().child('chat-members/' + mercurioUser.userId).push().key;

  	//determine if contact number belongs to a mercurio user and if so find that user's id
  	//before updating the new contact's attributes in firebase
    var memberProperties={
      "isAdmin":false,
      "isMember":true,
      "isTyping":false
    }
  	var updates = {};
  	updates['/chat-members/' + key + "/" + mercurioUser.userId] = memberProperties;
    updates['/chat-members/' + key + "/" + from] = memberProperties;
  	firebase.database().ref().update(updates).then(function(){
      var newMessageKey = addMessage(message, key);
      message.messageId=newMessageKey;
      var updates = {};
    	firebase.database().ref().child('message-info/' + newMessageKey + "/has-message/" + mercurioUser.userId).set(true);
      firebase.database().ref().child('message-info/' + newMessageKey + "/read/" + mercurioUser.userId).set(0);
      firebase.database().ref().update(updates).then(function(){
        var updates={}
        updates['/user-chats/' + mercurioUser.userId + "/" + key+"/"+"lastMessage"] = message;
        firebase.database().ref().child('user-chats/' + mercurioUser.userId + "/" + key+"/settings/mute").set(false);
        firebase.database().ref().child('user-chats/' + mercurioUser.userId + "/" + key+"/timeStamp").set(Date.now());
        firebase.database().ref().child('user-chats/' + mercurioUser.userId + "/" + key+"/title").set("");
        firebase.database().ref().child('user-chats/' + mercurioUser.userId + "/" + key+"/type").set('sms');
        firebase.database().ref().child('user-chats/' + mercurioUser.userId + "/" + key+"/participantCount").set(2);

        firebase.database().ref().update(updates).then(function(){
          res.sendStatus(200)
        })
      });
    });
  }

}
