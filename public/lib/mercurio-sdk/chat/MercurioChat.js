/*
@constructor
@params: title - string containing title of message
@params: participants - array containing a collection of particpants
*/

function MercurioChat(chatId, participantCount, participantsAreReadyObserver,
	lastMessage, settings, timeStamp, title, chatClientOwner){

	AbstractChat.apply(this,arguments);
	
	var self = this;
	self.groupPicture = groupPicture;
	self.isTypingObserver = null;

	//firebase.database().ref('chat-members/' + self.chatId).on('child_added', function(snapshot) {
    //
	//	if(snapshot.exists() && snapshot.val()){
	//		// if participant has true value instantiate participnat and add to list
	//		var participant = new MercurioChatParticipant(snapshot.key, function(newParticipant){
	//			newParticipant.isAdmin = snapshot.val()['isAdmin'];
	//			newParticipant.isTyping = snapshot.val()['isTyping'];
	//			newParticipant.isMember = snapshot.val()['isMember'];
	//			if(newParticipant.isMember){
	//				self.participantList.push(newParticipant);
	//			}
	//		});
	//	}
	//});
    //
	//firebase.database().ref('chat-members/' + self.chatId).on('child_changed', function(snapshot) {
	//	var participantExist = false;
	//	if(snapshot.exists()){
	//		self.participantList.forEach(function(participant, index){
	//			if(participant.userId == snapshot.key){
	//				participantExist = true;
	//				participant.isTyping = snapshot.val()['isTyping'];
	//				participant.isAdmin = snapshot.val()['isAdmin'];
	//				participant.isMember = snapshot.val()['isMember'];
	//				//change name here
	//				if(self.isTypingObserver){
	//					self.isTypingObserver();
	//				}
	//				if(!participant.isMember){
	//					self.participantList.splice(index, 1);
	//				}
	//			}
	//		})
	//		if(!participantExist && snapshot.val()['isMember']){
	//			var participant = new MercurioChatParticipant(snapshot.key, function(newParticipant){
	//				newParticipant.isMember = snapshot.val()['isMember'];
	//				self.participantList.push(newParticipant);
	//			});
	//		}
	//	}
	//});
}

MercurioChat.prototype = Object.create(AbstractChat.prototype);

MercurioChat.prototype.constructor = MercurioChat;

MercurioChat.prototype.instantiateParticipant = function(chatClientOwner, participantId, participantIsReadyCallback){

	new MercurioChatParticipant(participantId, participantIsReadyCallback);
}

MercurioChat.prototype.getMessageList = function(){

	//firebase.database().ref('chat-messages/' + self.chatId).orderByChild('timeStamp').limitToLast(1 * pageNumber * limit).on("child_added", function(messageSnapshot) {
	//	// firebase.database().ref('message-info/' + messageSnapshot.key).on("value", function(messageInfoSnapshot){
	//	// 	self.newMessage = new Message(messageSnapshot.key, messageSnapshot.val().from, messageSnapshot.val().multimediaUrl, messageSnapshot.val().textContent, messageSnapshot.val().timeStamp, messageInfoSnapshot.val().read[chatClientOwner]);
	//	// 	if(self.newMessage != null){
	//	// 		if(messageInfoSnapshot.val()['has-message'][chatClientOwner]){
	//	// 			self.messageList.push(self.newMessage);
	//	// 			if(messageInfoSnapshot.val()['read'][chatClientOwner]==0){
	//	// 					self.unreadMessage +=1;
	//	// 							}
	//	// 		}
	//	// 	}
	//	// 	else{
	//	// 		self.messageList.forEach(function(message, index){
	//	// 			if(message.messageId == messageInfoSnapshot.key){
	//	// 				message.read = messageInfoSnapshot.val()['read'][chatClientOwner];
	//	// 				if(!messageInfoSnapshot.val()['has-message'][chatClientOwner]){
	//	// 					self.messageList.splice(index, 1);
	//	// 				}
	//	// 			}
	//	// 		});
	//	// 	}
	//	// 	self.newMessage =null;
	//	// })
    //
	//	if(messageSnapshot.exists()){
    //
	//		newMessageKey = messageSnapshot.key;
    //
	//		firebase.database().ref('message-info/' + messageSnapshot.key).once("value", function(messageInfoSnapshot) {
    //
	//			if(messageInfoSnapshot.exists()){
    //
	//				if(messageInfoSnapshot.val()['has-message'][chatClientOwner]){
	//					var message;
	//					message = new Message(messageSnapshot.key, messageSnapshot.val().from, messageSnapshot.val().multimediaUrl, messageSnapshot.val().textContent, messageSnapshot.val().timeStamp, messageInfoSnapshot.val().read[chatClientOwner]);
	//					self.messageList.push(message);
	//					if(messageInfoSnapshot.val()['read'][chatClientOwner]==0){
	//						self.unreadMessage +=1;
	//					}
	//				}
    //
	//				self.initMessageInfoChildChanged(messageSnapshot.key, chatClientOwner);
	//			}
    //
	//		});
	//	}

	//firebase.database().ref('chat-messages/' + self.chatId).orderByChild('timeStamp').limitToFirst(pageNumber * limit).on('child_changed', function(snapshot) {
	//	//When the multimediaUrl is assign from firebase, assign it locally.
	//	self.messageList.forEach(function(message, index){
	//		if(message.messageId === snapshot.key){
	//			self.messageList[index].multimediaUrl = snapshot.val().multimediaUrl;
	//		}
	//	});
	//});
		
	return this.messageList;
}

MercurioChat.prototype.saveChatTitleWithParticipant = function(chatId, participantId, newChatTitle){

	self.updateChatTitleInFirebase(chatId, participantId, newChatTitle);
}

MercurioChat.prototype.addParticipantsWithPhoneNumbersToList = function(phoneNumbers, newParticipants){

	//var self = this;
	//phoneNumbers.forEach(function(participant){
	//	self.addParticipantToList(participant.participantId, newParticipants);
	//});

	return;
}

MercurioChat.prototype.updateParticipantCount = function(participantId, count){

	//if(parseInt(participantId) == undefined){
	//	var updates = {};
	//	updates['/user-chats/' + participantId + "/" + chatId + '/participantCount'] = count;
	//	firebase.database().ref().update(updates);
	//}
	//else{
	//	//do something with sms chat participant id (return maybe..)
	//}

	var updates = {};
	updates['/user-chats/' + participantId + "/" + self.chatId + '/participantCount'] = count;
	firebase.database().ref().update(updates);
}

MercurioChat.prototype.initMessageInfoChildChanged = function(messageId, chatClientOwner){
	var self = this;

	firebase.database().ref('message-info/' + messageId).on("child_changed", function(messageInfoSnapshot) {
		if(messageInfoSnapshot.exists()){
			self.messageList.forEach(function(message, index){
				if(message.messageId == messageId){
					if(typeof(messageInfoSnapshot.val()[chatClientOwner]) === 'number' && messageInfoSnapshot.val()[chatClientOwner] != message.read){
						message.read = messageInfoSnapshot.val()[chatClientOwner];
						self.unreadMessage -=1;
					}
					else if(typeof(messageInfoSnapshot.val()[chatClientOwner]) === 'boolean' && !messageInfoSnapshot.val()[chatClientOwner]){
						self.messageList.splice(index, 1);
					}
				}
			});
		}

	});
}


// part of addprticipants
//groupPicture: self.groupPicture || ''
//};
//
//
//newParticipants.forEach(function(participant){
//	// add participant to chat-members
//	firebase.database().ref().child('chat-members/' + self.chatId + "/" + participant + "/isMember").set(true);
//	firebase.database().ref().child('chat-members/' + self.chatId + "/" + participant + "/isAdmin").set(false);
//	firebase.database().ref().child('chat-members/' + self.chatId + "/" + participant + "/isTyping").set(false);
//	firebase.database().ref('user-chats/' + participant + "/" + self.chatId).once("value", function(snapshot){
//		if(snapshot.exists()){
//			chatInfo.lastMessage = snapshot.val()['lastMessage'];
//		}
//		updates = {};
//		// add user-chat entry for participant
//		updates['/user-chats/' + participant + "/" + self.chatId] = chatInfo;
//		firebase.database().ref().update(updates);
//	})
//
//});


MercurioChat.prototype.addUserChatEntryToNewParticipant = function(participantId, newParticipantCount){

	//if(parseInt(participantId) == undefined){
	//	var chatInfo = {
	//		lastMessage: {},
	//		timeStamp: new Date().getTime(),
	//		title: self.title || '',
	//		participantCount: newParticipantCount,
	//		settings: {mute:false}
	//	};
    //
	//	var updates = {};
	//	// add user-chat entry for participant
	//	updates['/user-chats/' + participantId + "/" + self.chatId] = chatInfo;
	//	firebase.database().ref().update(updates);
	//}
	//else{
	//	//do something with sms chat participant id (return maybe..)
	//}

	var chatInfo = {
		lastMessage: {},
		timeStamp: new Date().getTime(),
		title: self.title || '',
		participantCount: newParticipantCount,
		settings: {mute:false}
	};

	var updates = {};
	// add user-chat entry for participant
	updates['/user-chats/' + participantId + "/" + self.chatId] = chatInfo;
	firebase.database().ref().update(updates);
}

MercurioChat.prototype.toggleIsTyping = function(value){
	var self = this;
	var updates = {};
	updates['/chat-members/' + self.chatId +'/' + self.chatClientOwner + '/isTyping' ] = value;
	firebase.database().ref().update(updates);
}

MercurioChat.prototype.deleteMessages = function(messages){

	var self = this;
	messages.forEach(function(message){
		firebase.database().ref('message-info/' + message + '/has-message/' + self.chatClientOwner).set(false);
	});
}

//falta
MercurioChat.prototype.setIsTypingObserver = function(observer){
	this.isTypingObserver = observer;
}

MercurioChat.prototype.assignAdmin = function(participantId){
	var self = this;
	updates = {};
	updates['/chat-members/' + self.chatId + "/" + participantId + '/isAdmin'] = true;
	firebase.database().ref().update(updates);
}

MercurioChat.prototype.removeParticipantFromChatGroup = function(participantId){

	var self = this;

	self.participantList.forEach(function(participant){
		updates = {};
		updates['/user-chats/' + participant.userId + "/" + self.chatId + '/participantCount'] = self.participantCount - 1;

		if(participant.userId === participantId){
			updates['/chat-members/' + self.chatId + "/" + participantId + '/isMember'] = false;
			updates['/chat-members/' + self.chatId + "/" + participantId + '/isAdmin'] = false;
		}

		firebase.database().ref().update(updates);
	});
}


//mark messages as read
//self.unreadMessage -=1;