/*
uses MissingImplementationError

@constructor

*/

function MercurioChatClient(userId, messageReceivedObserver){

	var self = this;
	self.chatList = [];
	self.chatClientOwner = userId;
	self.messageReceivedObserver = messageReceivedObserver;
	self.chatIsReadyToSendObserver = null;
	//Uploading Image variables
	self.uploadingImage = false;
	self.uploadingProgress = 0;

	var pageNumber = 1;
	var limit = 50;

	firebase.database().ref('user-chats/' + self.chatClientOwner).orderByChild('lastMessage/timeStamp').on('child_changed', function(snapshot) {
	  	//compare contact ids from local contact list to snapshot keys in order to find local
		//reference to contact; use that contact's setters to update the local reference

	  	var chatFound = false;
	  	self.chatList.forEach(function(chat, index){
			if(chat.chatId === snapshot.key){

				chatFound = true;

				chat.settings = snapshot.val().settings;
				chat.timeStamp = snapshot.val().timeStamp;
				chat.title = snapshot.val().title;
				chat.participantCount = snapshot.val().participantCount;

				if(!snapshot.val().lastMessage){
					self.chatList.splice(index, 1);
				}
				else{

					if(!chat.lastMessage || chat.lastMessage.timeStamp != snapshot.val().lastMessage.timeStamp){

						chat.lastMessage = snapshot.val().lastMessage;
						// self.chatList.sort(function(a, b){
	// 						if(!b.lastMessage || !a.lastMessage){
	// 							return 0;
	// 						}
	// 						else{
	// 							return b.lastMessage.timeStamp - a.lastMessage.timeStamp;
	// 						}
	// 					});

						self.chatList.splice(index, 1);
						self.chatList.unshift(chat);

						// call observer to notify view that a new chat message has been received
						self.messageReceivedObserver(chat, index);
					}
				}
			}
		});

		if(!chatFound){
			self.fetchChatListPage(pageNumber, limit);
		}
	});

	self.fetchChatListPage(pageNumber, limit);
}

MercurioChatClient.prototype.getChatList = function(){
	return this.chatList;
}

MercurioChatClient.prototype.fetchChatListPage = function(pageNumber, limit){

	var self = this;

	//empty out chatList to make room for it's updated copy
	self.chatList = [];

	// fetch list of 50 most recent chats
	// TODO missing pagination and filters

	firebase.database().ref('user-chats/' + self.chatClientOwner).orderByChild('lastMessage/timeStamp').limitToFirst(1 * pageNumber * limit).on("child_added", function(snapshot) {

		//if(snapshot.val().lastMessage != undefined){

			var chat;
			// send observer callback registered in addChat to MercurioChat constructor
			//if(snapshot.val().lastMessage){
				//chat = new MercurioChat(snapshot.key, snapshot.val().participantCount);
			//}
			chat = new MercurioChat(snapshot.key, snapshot.val().participantCount, self.participantsAreReadyObserver,
					snapshot.val().lastMessage, snapshot.val().settings, snapshot.val().timeStamp, snapshot.val().title, self.chatClientOwner);

			self.chatList.unshift(chat);

			if(self.chatIsReadyToSendObserver){
				self.chatIsReadyToSendObserver(chat);
			}

		//}

	});

	firebase.database().ref('user-chats/' + self.chatClientOwner).orderByChild('lastMessage/timeStamp').limitToFirst(pageNumber * limit).on('child_removed', function(snapshot) {

		//compare chat ids from local chat list to snapshot keys in order to find local
		//reference to chat; remove chat from local contacts list

		self.chatList.forEach(function(chat, index){
			if(chat.chatId === snapshot.key){
				self.chatList.splice(index, 1);
			}
		});
	});
}

/*
Requests server to create a chat and add it to the database
@method
@params: chatInfo - JSON object with chat attributes (including participantCount)
*/

MercurioChatClient.prototype.createChat = function(title, contacts, observer){

	var self = this;
	var participants = [];
	var existingChat = null;
	self.chatIsReadyToSendObserver = observer;

	contacts.forEach(function(contact){
		if(contact.userId != '' || contact.userId !== undefined){
			// contact is a mercurio user
			participants.push(contact.userId);
		}
	});

	participants.push(self.chatClientOwner);

	if(!title){
		firebase.database().ref('user-chats/' + self.chatClientOwner).orderByChild('title').equalTo('').once('value', function(chats){
			var userChats = chats; //Get every user with empty title
			userChats.forEach(function (chat){
				firebase.database().ref('chat-members/' + chat.key).once('value', function(chatMembers){
					var members = Object.keys(chatMembers.val()); //get memebers in every in memebers-chat
					var counter = 0;
					members.forEach(function (member){
						for(var i=0; i<participants.length; i++){
							if(member == participants[i]){
								counter++;
							}
						}
					});
					if(counter==2){
						existingChat=chat;
					}
				})
			});
		});
	}

	if(participants.length > 1) {
		// chat client owner is not the only participant in the list
		// receive observer call back in addChat parameters and register the callback to this
		//self.participantsAreReadyObserver = observer;
		if (existingChat == null) {
			var newChatRef = firebase.database().ref().child('user-chats/' + self.chatClientOwner).push();
			var newChatKey = newChatRef.key;

			var chatInfo = {
				lastMessage: {},
				timeStamp: new Date().getTime(),
				title: title || '',
				participantCount: participants.length,
				settings: {mute: false}
			};

			var updates = {};

			participants.forEach(function (participant) {
				// add participant to chat-members
				firebase.database().ref().child('chat-members/' + newChatKey + "/" + participant).set(true).then(function () {
					updates = {};
					// add user-chat entry for participant
					updates['/user-chats/' + participant + "/" + newChatKey] = chatInfo;
					firebase.database().ref().update(updates).then(function () {
						//observer();
					});
				});
			});
		}
		else {
			// chat already existe
			// try and find chat in local chatList. if found move that chat to the top
			// if its not in the local list add  new instance to chatList using the MercurioChat constructor
			// and add it to the top of the list. call observer at the end
			var chatFound = false;
			var newChat = null;
			self.chatList.forEach(function (chat, index) {
				if (chat.chatId === existingChat.key && !chatFound) {
					chatFound = true;
					self.chatList.splice(index, 1);
					self.chatList.unshift(chat);
					newChat = chat;
				}
			});

			if (!chatFound) {
				var chat;

				chat = new MercurioChat(existingChat.key, existingChat.val().participantCount, self.participantsAreReadyObserver,
					existingChat.val().lastMessage, existingChat.val().settings, existingChat.val().timeStamp, existingChat.val().title, self.chatClientOwner);

				self.chatList.unshift(chat);
				newChat = chat;
			}

			self.chatIsReadyToSendObserver(newChat);
		}
	}

	/* buggy code for avoiding duplicate non-group chats
	var existingParticipants = [];
	if(participants.length === 2){
		firebase.database().ref('user-chats/' + self.chatClientOwner).once('child_added', function(outerSnapshot){
			if(outerSnapshot.val().participantCount == 2){
				firebase.database().ref('chat-members/' + outerSnapshot.key).once('child_added', function(innerSnapshot){
					existingParticipants.push(innerSnapshot.key);
				}).then(function(){
					var matchedParticipantCount = 0;
					existingParticipants.forEach(function(existingParticipant){
						if(participants.indexOf(existingParticipant) > -1){
							matchedParticpantCount++;
						}
					});
					if(matchedParticipantCount === 2){
						return; //chat already exists
					}
				});
			}
		});
	}*/
}

/*
Requests server to delete a list of chats from the database
@method
@params: indexes - integer array containing indexes of chats to remove from recent chats
*/

MercurioChatClient.prototype.deleteChats = function(indices){
	var self = this;
	indices.forEach(function(index){
		firebase.database().ref('user-chats/' + self.chatClientOwner + '/' + self.chatList[index].chatId + '/lastMessage').set(null);
		firebase.database().ref('user-chats/' + self.chatClientOwner + '/' + self.chatList[index].chatId + '/timeStamp').set(0);
	});
}

/*
Requests server to search for a filtered a list of chats from the database
@method
@params: searchString - string filter to apply to search
*/

MercurioChatClient.prototype.searchChats = function(searchString){
	throw new MissingImplementationError("Function searchChats(searchString) is missing it's implementation!");
}

/*
Sends a chat message to server
@method
@params: chatIndex - index of the recent chat to which the send message belongs to
		 message - AbstractMessage object
*/

MercurioChatClient.prototype.sendMultimediaMessage = function(chat, message, sendUploadStatus){

	var self = this;

	if(!message.multimediaUrl){
		message.multimediaUrl = "";
	}

	var newMessageKey = chat.addMessage(message);

	if(message.multimediaUrl){
		var uploadTask = firebase.storage().ref().child('chats/' + chat.chatId + '/images/' + newMessageKey).put(message.multimediaUrl);

		//
		// Listen for state changes, errors, and completion of the upload.
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
          function(snapshot) {
						self.uploadingImage = true;
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
						if(progress<100){
							sendUploadStatus(progress, true, message);
						}
            switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused');
                break;
              case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running');
                break;
            }
          }, function(error) {
						self.uploading = false;
          switch (error.code) {
            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              break;

            case 'storage/canceled':
              // User canceled the upload
              break;

            case 'storage/unknown':
              // Unknown error occurred, inspect error.serverResponse
              break;
          }
        }, function() {
          // Upload completed successfully, now we can get the download URL
					message.multimediaUrl = uploadTask.snapshot.downloadURL;

					var updates = {};
					updates['/chat-messages/' + chat.chatId + "/" + newMessageKey + "/multimediaUrl"] = message.multimediaUrl;

					firebase.database().ref().update(updates);
					console.log("sending...!!")
					self.sendTextMessage(chat, newMessageKey, message);
					sendUploadStatus(100, false, message);
        });
	}
	else{

		self.sendTextMessage(chat, newMessageKey, message);
	}

}

MercurioChatClient.prototype.sendTextMessage = function(chat, newMessageKey, message){

	var self = this;
	var user = {"firstName":""};
	function sendPushNotification(pushToken, participant){
		var tokenArray = [];
		if(pushToken == null){
			user = participant;
		}
		else{
			//Convert Not Iterable JSON to an array
			var array = Object.keys(pushToken);
			tokenArray = angular.copy(array);
		}
		if(tokenArray.length>0){
			$.ajax({
		    url: "/sendNotification",
		    type: "post",
		    contentType: "application/json; charset=utf-8",
		    data: JSON.stringify(
					{
						"tokens" : tokenArray,
						"messageTitle" :  user.firstName,
						"messageBody" : message.textContent
					}
				),
				success: function() {
					tokenArray.length = 0;
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					tokenArray.length = 0;
				}
		  });
		}

	}

	firebase.database().ref().child('message-info/' + newMessageKey + "/read/" + self.chatClientOwner).set(message.timeStamp);

	chat.participantList.forEach(function(participant){

		if(participant.userId !== self.chatClientOwner){
			firebase.database().ref().child('message-info/' + newMessageKey + "/read/" + participant.userId).set(0);
		}

		firebase.database().ref().child('user-tokens/'+participant.userId).once('value', function(snapshot){
			// console.log("sending... "+snapshot.val());
			sendPushNotification(snapshot.val(), participant);
		});

		firebase.database().ref().child('message-info/' + newMessageKey + "/has-message/" + participant.userId).set(true);

		var updates = {};
		message.messageId = newMessageKey;

		updates['/user-chats/' + participant.userId + "/" + chat.chatId + "/lastMessage"] = message;

		firebase.database().ref().update(updates);
	});

	// var chat = self.chatList[chatIndex];
// 	self.chatList.splice(chatIndex, 1);
// 	self.chatList.unshift(chat);
}

/*
Receives a chat message from server, instantiates the appropriate concrete message object,
and adds it to its corresponding recent chat
@method
@params: chatIndex - index of the recent chat to which the send message belongs to
@params: type - string containing type of concrete message to receive
@params: message - JSON object containing the received message's content

messageContent must be structured as shown below:

*** JSON example of message here ***

*/

MercurioChatClient.prototype.receiveMessage = function(chatIndex, type, message){

	//service worker probably goes here..
	throw new MissingImplementationError("Function receiveMessage(chatIndex, type, messageContent) is missing it's implementation!");
}
