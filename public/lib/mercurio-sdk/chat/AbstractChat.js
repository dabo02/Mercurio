/*
uses ConstructorError, AbstractFunctionError
@constructor Constructor for AbstractChat class
@params: title - string containing title of chat
@params: participants - array containing a collection of particpants
*/

function AbstractChat(chatId, participantCount, participantsAreReadyObserver,
					  lastMessage, settings, timeStamp, title, chatClientOwner){

	if(this.constructor === AbstractChat){
		throw new ConstructorError("Cannot instantiate AbstractChat class!");
	}

	var self = this;
	self.chatId = chatId;
	self.lastMessage = lastMessage;
	self.settings = settings;
	self.timeStamp = timeStamp;
	self.title = title;
	self.participantList =[]; //array of participants
	self.messageList = [];
	self.participantCount = participantCount;

	firebase.database().ref('chat-members/' + self.chatId).on('child_added', function(snapshot) {

		if(snapshot.exists() && snapshot.val()){
			// if participant has true value instantiate participant and add to list
			self.instantiateParticipant(chatClientOwner, snapshot.key, function(newParticipant){

				self.participantList.push(newParticipant);

				// if(self.participantList.length === participantCount){
// 					if(participantsAreReadyObserver){
// 						//participantsAreReadyObserver(self);
// 						//participantsAreReadyObserver = undefined;
// 					}
// 				}
			});
		}
	});

	firebase.database().ref('chat-members/' + self.chatId).on('child_changed', function(snapshot) {

		if(snapshot.exists()){

			var participantIndex = null;

			self.participantList.forEach(function(participant, index){
				if(participant.participantId === snapshot.key){
					participantIndex = index;
				}
			});

			if(snapshot.val()){
				// if value changed to true instantiate new participant and add to list
				self.instantiateParticipant(chatClientOwner, snapshot.key, function(newParticipant){
					if(participantIndex == null){
						self.participantList.push(newParticipant);
					}
					else{
						self.participantList[participantIndex] = newParticipant;
					}
				});
			}
			else{
				// if value changed to false remove participant from list
				if(participantIndex != null){
					self.participantList.splice(participantIndex, 1);
				}
			}
		}
	});

	var pageNumber = 1;
	var limit = 50;

	self.fetchMessageListPage(pageNumber, limit, chatClientOwner);
}

AbstractChat.prototype.fetchMessageListPage = function(pageNumber, limit, chatClientOwner){

	var self = this;

	//empty out messageList to make room for it's updated copy
	self.messageList = [];

	// fetch list of 50 most recent chats
	// TODO missing pagination and filters

	var newMessageKey = null;

	firebase.database().ref('chat-messages/' + self.chatId).orderByChild('timeStamp').limitToLast(1 * pageNumber * limit).on("child_added", function(messageSnapshot) {

		if(messageSnapshot.exists()){

			newMessageKey = messageSnapshot.key;

			firebase.database().ref('message-info/' + messageSnapshot.key).once("value", function(messageInfoSnapshot) {

				if(messageInfoSnapshot.exists()){

					if(messageInfoSnapshot.val()['has-message'][chatClientOwner]){
						var message;
						message = new Message(messageSnapshot.key, messageSnapshot.val().from, messageSnapshot.val().multimediaUrl, messageSnapshot.val().textContent, messageSnapshot.val().timeStamp, messageInfoSnapshot.val().read[chatClientOwner]);
						self.messageList.push(message);
					}
				}

			});
		}

	});
}

/*

Requests server to add a message to the chat list in database and updates its local copy
@method
@abstract
@params: messageInfo - message object to add to

*/


AbstractChat.prototype.addMessage = function(message){

	var newMessageKey = firebase.database().ref().child('chat-messages/' + this.chatId).push().key;

	//determine if contact number belongs to a mercurio user and if so find that user's id
	//before updating the new contact's attributes in firebase

	var updates = {};
	updates['/chat-messages/' + this.chatId + "/" + newMessageKey] = message;

	firebase.database().ref().update(updates);

	return newMessageKey;
}


AbstractChat.prototype.addParticipants = function(contacts, phoneNumbers){

	var self = this;

	var newParticipants = [];

	self.addMercurioParticipantsToList(contacts, newParticipants);

	// TODO function to loop through phone number participants implemented in concrete chat classes
	self.addParticipantsWithPhoneNumbersToList(phoneNumbers, newParticipants);

	if(newParticipants.length > 0){
		// there is at least one mercurio user to add as new chat member

		var newParticipantCount = self.participantCount + newParticipants.length;

		// update participant count for existing chat members
		self.participantList.forEach(function(participant){

			// TODO function to process sms/merc chat participants
			self.updateParticipantCount(self.chatId, participant.participantId, newParticipantCount);
		});

		newParticipants.forEach(function(participantId){
			// TODO function to process sms/merc chat participants
			// add participant to chat-members
			firebase.database().ref().child('chat-members/' + self.chatId + "/" + participantId).set(true).then(function(){

				self.addUserChatEntryToNewParticipant(participantId, newParticipantCount);
			});
		});
	}

}

AbstractChat.prototype.addMercurioParticipantsToList = function(contacts, newParticipants){
	var self = this;
	contacts.forEach(function(contact){
		if(contact.userId != '' || contact.userId !== undefined){
			// contact is a mercurio user

			self.addParticipantToList(contact.userId, newParticipants)
		}
	});
}

AbstractChat.prototype.addParticipantToList = function(participantId, newParticipants){

	var self = this;

	var isNewParticipant = true; // innocent until proven guilty
	self.participantList.forEach(function(participant){
		if(participant.userId === participantId){
			// contact is already a group member (guilty)
			isNewParticipant = false;
		}
	});

	if(isNewParticipant){
		// contact is not an existing group member
		newParticipants.push(participantId);
	}
}

AbstractChat.prototype.deleteMessages = function(indices){

	var self = this;
	indices.forEach(function(index){
		firebase.database().ref('chat-messages/' + self.chatId + '/' + self.messageList[index].messageId).set(null);
	});
}

AbstractChat.prototype.getParticipants = function(){
	return this.participantList;
}

AbstractChat.prototype.toggleNotifications = function(userId, value){
	var self = this;
	var updates = {};
	updates['/user-chats/' + userId + "/" + self.chatId + '/settings/mute'] = value;
	firebase.database().ref().update(updates);
}

AbstractChat.prototype.saveChatTitle = function(newChatTitle){

	var self = this;

	// update chat title for existing chat members
	self.participantList.forEach(function(participant){
		self.saveChatTitleWithParticipant(participant.participantId, self.chatId, newChatTitle);
	});
}

AbstractChat.prototype.updateChatTitleInFirebase = function(chatId, participantId, newChatTitle){

	var self = this;

	// update chat title for existing chat members
	self.participantList.forEach(function(participant){
		var updates = {};
		updates['/user-chats/' + participant.participantId + "/" + self.chatId + '/title'] = newChatTitle;
		firebase.database().ref().update(updates);
	});
}

AbstractChat.prototype.markUnreadMessagesAsRead = function(userId){

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
		}
	});
}