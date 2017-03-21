/*
@constructor
@params: title - string containing title of message
@params: participants - array containing a collection of particpants
*/

function MercurioChat(chatId, participantCount, participantsAreReadyObserver,
	lastMessage, settings, timeStamp, title, chatClientOwner, groupPicture){

	var self = this;
	self.chatId = chatId;
	self.lastMessage = lastMessage;
	self.settings = settings;
	self.timeStamp = timeStamp;
	self.title = title;
	self.participantList =[]; //array of participants
	self.messageList = [];
	self.participantCount = participantCount;
	self.unreadMessage = 0;
	self.groupPicture = groupPicture;
	self.chatClientOwner = chatClientOwner;
	self.isTypingObserver = null;

	firebase.database().ref('chat-members/' + self.chatId).on('child_added', function(snapshot) {

		if(snapshot.exists() && snapshot.val()){
			// if participant has true value instantiate participnat and add to list
			var participant = new MercurioChatParticipant(snapshot.key, function(newParticipant){
			newParticipant.isAdmin = snapshot.val()['isAdmin'];
			newParticipant.isTyping = snapshot.val()['isTyping'];
			newParticipant.isMember = snapshot.val()['isMember'];
			if(newParticipant.isMember){
				self.participantList.push(newParticipant);
			}
			});
		}
	});

	firebase.database().ref('chat-members/' + self.chatId).on('child_changed', function(snapshot) {
		var participantExist = false;
		if(snapshot.exists()){
				self.participantList.forEach(function(participant, index){
					if(participant.userId == snapshot.key){
						participantExist = true;
						participant.isTyping = snapshot.val()['isTyping'];
						participant.isAdmin = snapshot.val()['isAdmin'];
						participant.isMember = snapshot.val()['isMember'];
						//change name here
						if(self.isTypingObserver){
							self.isTypingObserver();
						}
						if(!participant.isMember){
							self.participantList.splice(index, 1);
						}
					}
				})
				if(!participantExist && snapshot.val()['isMember']){
						var participant = new MercurioChatParticipant(snapshot.key, function(newParticipant){
						newParticipant.isMember = snapshot.val()['isMember'];
						self.participantList.push(newParticipant);
					});
				}
		}
	});

	var pageNumber = 1;
	var limit = 50;

	self.fetchMessageListPage(pageNumber, limit, chatClientOwner)
}

MercurioChat.prototype.getMessageList = function(){
	return this.messageList;
}

MercurioChat.prototype.fetchMessageListPage = function(pageNumber, limit, chatClientOwner){

	var self = this;

	//empty out messageList to make room for it's updated copy
	self.messageList = [];

	// fetch list of 50 most recent chats
	// TODO missing pagination and filters

	var newMessageKey = null;

	firebase.database().ref('chat-messages/' + self.chatId).orderByChild('timeStamp').limitToLast(1 * pageNumber * limit).on("child_added", function(messageSnapshot) {
		// firebase.database().ref('message-info/' + messageSnapshot.key).on("value", function(messageInfoSnapshot){
		// 	self.newMessage = new Message(messageSnapshot.key, messageSnapshot.val().from, messageSnapshot.val().multimediaUrl, messageSnapshot.val().textContent, messageSnapshot.val().timeStamp, messageInfoSnapshot.val().read[chatClientOwner]);
		// 	if(self.newMessage != null){
		// 		if(messageInfoSnapshot.val()['has-message'][chatClientOwner]){
		// 			self.messageList.push(self.newMessage);
		// 			if(messageInfoSnapshot.val()['read'][chatClientOwner]==0){
		// 					self.unreadMessage +=1;
		// 							}
		// 		}
		// 	}
		// 	else{
		// 		self.messageList.forEach(function(message, index){
		// 			if(message.messageId == messageInfoSnapshot.key){
		// 				message.read = messageInfoSnapshot.val()['read'][chatClientOwner];
		// 				if(!messageInfoSnapshot.val()['has-message'][chatClientOwner]){
		// 					self.messageList.splice(index, 1);
		// 				}
		// 			}
		// 		});
		// 	}
		// 	self.newMessage =null;
		// })

		if(messageSnapshot.exists()){

			newMessageKey = messageSnapshot.key;

			firebase.database().ref('message-info/' + messageSnapshot.key).once("value", function(messageInfoSnapshot) {

				if(messageInfoSnapshot.exists()){

					if(messageInfoSnapshot.val()['has-message'][chatClientOwner]){
						var message;
						message = new Message(messageSnapshot.key, messageSnapshot.val().from, messageSnapshot.val().multimediaUrl, messageSnapshot.val().textContent, messageSnapshot.val().timeStamp, messageInfoSnapshot.val().read[chatClientOwner]);
						self.messageList.push(message);
						if(messageInfoSnapshot.val()['read'][chatClientOwner]==0){
								self.unreadMessage +=1;
							}
					}

					self.initMessageInfoChildChanged(messageSnapshot.key, chatClientOwner);
				}

			});
		}

	});

	firebase.database().ref('chat-messages/' + self.chatId).orderByChild('timeStamp').limitToFirst(pageNumber * limit).on('child_changed', function(snapshot) {
		//When the multimediaUrl is assign from firebase, assign it locally.
	  	self.messageList.forEach(function(message, index){
			if(message.messageId === snapshot.key){
				self.messageList[index].multimediaUrl = snapshot.val().multimediaUrl;
			}
		});
	});

/*

	******* REVIEW CASE WHEN MESSAGE IS DELETED *******

	firebase.database().ref('chat-messages/' + self.chatId).limitToFirst(pageNumber * limit).on('child_removed', function(snapshot) {

		//compare message ids from local message list to snapshot keys in order to find local
		//reference to message; remove message from local contacts list

		self.messageList.forEach(function(message, index){
			if(message.messageId === snapshot.key){
				self.messageList.splice(index, 1);
			}
		});
	});
	*/
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

MercurioChat.prototype.addMessage = function(message){

	var newMessageKey = firebase.database().ref().child('chat-messages/' + this.chatId).push().key;

	//determine if contact number belongs to a mercurio user and if so find that user's id
	//before updating the new contact's attributes in firebase

	var updates = {};
	updates['/chat-messages/' + this.chatId + "/" + newMessageKey] = message;
	firebase.database().ref().update(updates);

	return newMessageKey;
}

MercurioChat.prototype.addParticipants = function(contacts){

	var self = this;

	var newParticipants = [];

	contacts.forEach(function(contact){
		if(contact.userId != '' || contact.userId !== undefined){
			// contact is a mercurio user

			var isNewParticipant = true; // innocent until proven guilty
			self.participantList.forEach(function(participant){
				if(participant.userId === contact.userId){
					// contact is already a group member (guilty)
					isNewParticipant = false;
				}
			});

			if(isNewParticipant){
				// contact is not an existing group member
				newParticipants.push(contact.userId);
			}
		}
	});

	if(newParticipants.length > 0){
		// there is at least one mercurio user to add as new chat member


		var newParticipantCount = self.participantCount + newParticipants.length;
		var updates = {};

		// update participant count for existing chat members
		self.participantList.forEach(function(participant){
			updates = {};
			updates['/user-chats/' + participant.userId + "/" + self.chatId + '/participantCount'] = newParticipantCount;
			firebase.database().ref().update(updates);
		});

		var chatInfo = {
			lastMessage: {},
			timeStamp: new Date().getTime(),
			title: self.title || '',
			participantCount: newParticipantCount,
			settings: {mute:false},
			groupPicture: self.groupPicture || ''
		};


		newParticipants.forEach(function(participant){
			// add participant to chat-members
			firebase.database().ref().child('chat-members/' + self.chatId + "/" + participant + "/isMember").set(true);
			firebase.database().ref().child('chat-members/' + self.chatId + "/" + participant + "/isAdmin").set(false);
			firebase.database().ref().child('chat-members/' + self.chatId + "/" + participant + "/isTyping").set(false);
			firebase.database().ref('user-chats/' + participant + "/" + self.chatId).once("value", function(snapshot){
				if(snapshot.exists()){
					chatInfo = snapshot.val();
				}
				updates = {};
				// add user-chat entry for participant
				updates['/user-chats/' + participant + "/" + self.chatId] = chatInfo;
				firebase.database().ref().update(updates);
			})

		});


	}
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

MercurioChat.prototype.getParticipants = function(){
	return this.participantList;
}

MercurioChat.prototype.toggleNotifications = function(userId, value){
	var self = this;
	var updates = {};
	updates['/user-chats/' + userId + "/" + self.chatId + '/settings/mute'] = value;
	firebase.database().ref().update(updates);
}

MercurioChat.prototype.markUnreadMessagesAsRead = function(userId){

	var self = this;

	self.messageList.forEach(function(oldMessage){
		if(oldMessage.read == 0){

			firebase.database().ref('message-info/' + oldMessage.messageId + "/read/" + userId).on("value", function(messageInfoSnapshot) {

				if(messageInfoSnapshot.exists()){

					self.messageList.forEach(function(newMessage){
						if(newMessage.messageId === oldMessage.messageId){
							// found updated message
							oldMessage.read = messageInfoSnapshot.val();
						}
					});
				}

			});

			firebase.database().ref().child('message-info/' + oldMessage.messageId + "/read/" + userId).set(new Date().getTime());
			self.unreadMessage -=1;
		}
	});
}

MercurioChat.prototype.saveChatTitle = function(newChatTitle){

	var self = this;

	// update chat title for existing chat members
	self.participantList.forEach(function(participant){
		updates = {};
		updates['/user-chats/' + participant.userId + "/" + self.chatId + '/title'] = newChatTitle;
		firebase.database().ref().update(updates);
	});
}

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
		}

		firebase.database().ref().update(updates);
	});
}
