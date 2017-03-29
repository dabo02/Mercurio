/*

uses ConstructorError, AbstractFunctionError

@constructor: Constructor for AbstractChatClient
@abstract
@params: notificationManager - NotificationManager object singleton
*/

function AbstractChatClient(userId, messageReceivedObserver){
	
	if(this.constructor === AbstractChatClient){
		throw new ConstructorError("Cannot instantiate AbstractChatClient class!");
	}

	var self = this;
	self.chatList = [];
	self.chatClientOwner = userId;
	self.messageReceivedObserver = messageReceivedObserver;
	self.chatIsReadyToSendObserver = null;
	//Uploading Image variables
	self.uploadingImage = false;
	self.uploadingProgress = 0;
	self.chatListIsReadyObserver = null;
	self.chatObserver = undefined;

	self.pageNumber = 1;
	self.limit = 50;

	self.fetchChatListChildChangedSnapshot(function(snapshot){

		self.processChatListChildChangedSnapshot(snapshot);
	});

	self.fetchChatListChildAddedSnapshot(self.pageNumber, self.limit, function(snapshot){

		self.processChatListChildAddedSnapshot(snapshot)
	});

	self.fetchChatListChildRemovedSnapshot(self.pageNumber, self.limit, function(snapshot){

		self.processChatListChildRemovedSnapshot(snapshot)
	});
}

AbstractChatClient.prototype.processChatListChildAddedSnapshot = function(snapshot){

	var self = this;

	var chat = self.instantiateChat(snapshot);

	binaryInsert(chat, self.chatList);

	if(self.chatIsReadyToSendObserver){
		self.chatIsReadyToSendObserver(chat);
	}

	if(self.chatListIsReadyObserver){
		// 	query fb once for complete chat list and find its length
		firebase.database().ref('user-chats/' + self.chatClientOwner).once("value", function(snapshot) {
			var fbChatListLength = snapshot.numChildren();
			if(fbChatListLength == self.chatList.length && self.chatListIsReadyObserver){
				self.chatListIsReadyObserver();
			}
            self.chatListIsReadyObserver = null;
		});
	}

	function binaryInsert(value, array, startVal, endVal){

		var length = array.length;
		var start = typeof(startVal) != 'undefined' ? startVal : 0;
		var end = typeof(endVal) != 'undefined' ? endVal : length - 1;//!! endVal could be 0 don't use || syntax
		var m = start + Math.floor((end - start)/2);

		if(!value.lastMessage){
			return;
		}

		if(length == 0){
			array.push(value);
			return;
		}

		if(value.lastMessage.timeStamp < array[end].lastMessage.timeStamp){
			array.splice(end + 1, 0, value);
			return;
		}

		if(value.lastMessage.timeStamp > array[start].lastMessage.timeStamp){//!!
			array.splice(start, 0, value);
			return;
		}

		if(start >= end){
			return;
		}

		if(value.lastMessage.timeStamp > array[m].lastMessage.timeStamp){
			binaryInsert(value, array, start, m - 1);
			return;
		}

		if(value.lastMessage.timeStamp < array[m].lastMessage.timeStamp){
			binaryInsert(value, array, m + 1, end);
			return;
		}

		//we don't insert duplicates
	}
}

AbstractChatClient.prototype.processChatListChildChangedSnapshot = function(snapshot){

	var self = this;

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
				self.chatList[index].lastMessage = undefined;
			}
			else{

				if(!chat.lastMessage || chat.lastMessage.timeStamp != snapshot.val().lastMessage.timeStamp){

					chat.lastMessage = snapshot.val().lastMessage;
					self.chatList.splice(index, 1);
					self.chatList.unshift(chat);

					// call observer to notify view that a new chat message has been received
					self.messageReceivedObserver(chat, index);
				}
			}
		}
	});

	if(!chatFound){
		self.fetchChatListChildAddedSnapshot(self.pageNumber, self.limit, function(snapshot){
			self.processChatListChildAddedSnapshot(snapshot)
		});
	}
}

AbstractChatClient.prototype.processChatListChildRemovedSnapshot = function(snapshot){

	var self = this;
	//compare chat ids from local chat list to snapshot keys in order to find local
	//reference to chat; remove chat from local contacts list

	self.chatList.forEach(function(chat, index){
		if(chat.chatId === snapshot.key){
			self.chatList.splice(index, 1);
		}
	});
}

/*
Requests server to add a chat to the database
@method
@abstract
@params: chat - Chat object
*/

AbstractChatClient.prototype.createChat = function(title, observer, userIds, phoneNumbers){

	var self = this;

	if(self.canCreateChatFromParticipants(userIds, phoneNumbers)){

		//var participants = [];
		var existingChat = null;
		self.chatIsReadyToSendObserver = observer;

		//contacts.forEach(function(contact){
		//	if(contact.userId != '' || contact.userId !== undefined){
		//		// contact is a mercurio user
		//		participants.push(contact.userId);
		//	}
		//});
        //
		//participants.push(self.chatClientOwner);

		//check for duplicates and if a duplicate is found save it in existingChat
		if(!title){
			firebase.database().ref('user-chats/' + self.chatClientOwner).orderByChild('title').equalTo('').once('value', function(chats){
				var userChats = chats; //Get every user with empty title
				userChats.forEach(function (chat){
					firebase.database().ref('chat-members/' + chat.key).once('value', function(chatMembers){
						var members = Object.keys(chatMembers.val()); //get memebers in every in memebers-chat
						var counter = 0;

						members.forEach(function (chatMember){
							for(var i=0; i < userIds.length; i++){
								if(chatMember == userIds[i]){
									counter++;
								}
							}

							counter = self.countChatDuplicatesWithParticipantPhoneNumbers(counter, phoneNumbers, chatMember);

						});

						if(counter==2){
							existingChat=chat;
						}
					})
				});
			});
		}

		//if(phoneNumbers.length > 0 || userIds.length > 1) {
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
					participantCount: userIds.length + phoneNumbers.length,
					settings: {mute: false},
				};

				self.setChatType(chatInfo);

				var updates = {};


				userIds.forEach(function (participant) {
					// add participant to chat-members
					if(participant == self.chatClientOwner){
						firebase.database().ref().child('chat-members/' + newChatKey + "/" + participant + "/isAdmin").set(true);
					}
					else{
						firebase.database().ref().child('chat-members/' + newChatKey + "/" + participant + "/isAdmin").set(false);
					}

					firebase.database().ref().child('chat-members/' + newChatKey + "/" + participant + "/isTyping").set(false);
					// add participant to chat-members
					firebase.database().ref().child('chat-members/' + newChatKey + "/" + participant + "/isMember").set(true).then(function () {
						updates = {};
						// add user-chat entry for participant
						updates['/user-chats/' + participant + "/" + newChatKey] = chatInfo;
						firebase.database().ref().update(updates).then(function () {
							//observer();
						});
					});
				});

				self.addParticipantsToChatWithPhoneNumbers(newChatKey, phoneNumbers);

			}
			else {
				// chat already exists
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

					chat = self.instantiateChat(existingChat);

					self.chatList.unshift(chat);
					newChat = chat;
				}

				// check if front end is correctly managing a null newChat
				self.chatIsReadyToSendObserver(newChat);
			}
		//}
	}
	else{
		//add error message handling here
	}

	return;

}


/*
Requests server to delete a list of chats from the database
@method
@abstract
@params: chatIndexes - integer array containing indexes of chats to remove from recent chats
*/

AbstractChatClient.prototype.deleteChats = function(indices){
	var self = this;
	indices.forEach(function(index){
		firebase.database().ref('user-chats/' + self.chatClientOwner + '/' + self.chatList[index].chatId + '/timeStamp').set(0);
		firebase.database().ref('user-chats/' + self.chatClientOwner + '/' + self.chatList[index].chatId + '/lastMessage').set(null);
	});
}

/*
Requests server to search for a filtered a list of chats from the database
@method
@abstract
@params: searchString - string filter to apply to search

*/

/*
 Sends a chat message to server
 @method
 @params: chatIndex - index of the recent chat to which the send message belongs to
 message - AbstractMessage object
 */

AbstractChatClient.prototype.sendMessage = function(chat, message, multimediaUploadStatus){

	var self = this;

	if(!message.multimediaUrl){
		message.multimediaUrl = "";
	}

	var newMessageKey = chat.addMessage(message);

	if(message.multimediaUrl){
		self.uploadMultimedia(chat, newMessageKey, message, multimediaUploadStatus);
	}
	else{

		self.uploadTextContent(chat, newMessageKey, message);
	}

}

AbstractChatClient.prototype.uploadMultimedia = function(chat, newMessageKey, message, multimediaUploadStatus){

	var self = this;
	var uploadTask = firebase.storage().ref().child('chats/' + chat.chatId + '/images/' + newMessageKey).put(message.multimediaUrl);

	//
	// Listen for state changes, errors, and completion of the upload.
	uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
		function(snapshot) {
			self.uploadingImage = true;
			// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
			var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
			if(progress<100){
				multimediaUploadStatus(progress, true, message);
			}
			switch (snapshot.state) {
				case firebase.storage.TaskState.PAUSED: // or 'paused'
					break;
				case firebase.storage.TaskState.RUNNING: // or 'running'
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

			self.uploadTextContent(chat, newMessageKey, message);
			multimediaUploadStatus(100, false, message);
		});
}

AbstractChatClient.prototype.uploadTextContent = function(chat, newMessageKey, message){

	var self = this;

	//if(!message.multimediaUrl){
	//	message.multimediaUrl = "";
	//}
    //
	//var newMessageKey = chat.addMessage(message);

	firebase.database().ref().child('message-info/' + newMessageKey + "/read/" + self.chatClientOwner).set(message.timeStamp);

	chat.participantList.forEach(function(participant){
		self.sendTextContentToParticipant(chat, participant, newMessageKey, message);
	});
}

AbstractChatClient.prototype.sendPushNotification = function(pushToken, participant, message){

	var user = {"firstName":""};

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
		var containsMultimedia = false;
		if(message.multimediaUrl.length > 0){
			containsMultimedia = true;
		}
		$.ajax({
			url: "/sendNotification",
			type: "post",
			contentType: "application/json; charset=utf-8",
			data: JSON.stringify(
				{
					"tokens" : tokenArray,
					"messageTitle" :  user.firstName,
					"messageBody" : message.textContent,
					"hasMultimedia" : containsMultimedia
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

AbstractChatClient.prototype.propagateMessageInFirebase = function(chat, participant, newMessageKey, message){

	var self = this;

	if(participant.participantId !== self.chatClientOwner){
		firebase.database().ref().child('message-info/' + newMessageKey + "/read/" + participant.participantId).set(0);
	}

	firebase.database().ref().child('message-info/' + newMessageKey + "/has-message/" + participant.participantId).set(true);

	//firebase.database().ref().child('user-tokens/' + participant.participantId).once('value', function(snapshot){
	//
	//	firebase.database().ref().child("user-chats").child(participant.participantId).child(chat.chatId)
	//		.once('value', function(actualChat){
	//			if(!actualChat.val().settings.mute){
	//				self.sendPushNotification(snapshot.val(), participant, message);
	//			}
	//		});
	//});

	var updates = {};
	message.messageId = newMessageKey;

	updates['/user-chats/' + participant.participantId + "/" + chat.chatId + "/lastMessage"] = message;

	firebase.database().ref().update(updates);
}

AbstractChatClient.prototype.searchChats = function(searchString){
	throw new AbstractFunctionError("Cannot call abstract function searchChats!");
}

AbstractChatClient.prototype.setChatObserver = function(chatObserver){
	this.chatObserver = chatObserver;
}

AbstractChatClient.prototype.setChatListObserver = function(observer){
    this.chatListIsReadyObserver = observer;
}