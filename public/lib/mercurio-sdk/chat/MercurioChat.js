/*
@constructor
@params: title - string containing title of message
@params: participants - array containing a collection of particpants
*/

function MercurioChat(chatId, participantCount, participantsAreReadyObserver,
	lastMessage, settings, timeStamp, title, chatClientOwner){
	
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
			// if participant has true value instantiate participnat and add to list
			var participant = new MercurioChatParticipant(snapshot.key, function(newParticipant){
			
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
			
			if(snapshot.val()){
				// if value changed to true instantiate new participant and add to list
				var participant = new MercurioChatParticipant(snapshot.key, function(newParticipant){
				
					self.participantList.push(newParticipant);
				
				});
			}
			else{
				// if value changed to false remove participant from list
				self.participantList.forEach(function(participant, index){
					if(participant.participantId === snapshot.key){
						self.participantList.splice(index, 1);
					}
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

	
	/*
	
	***** I BELEIVE THIS IS NOT NEEDED *****
	
	firebase.database().ref('chat-messages/' + self.chatId).limitToFirst(pageNumber * limit).once('child_changed', function(snapshot) {
	  	//compare contact ids from local contact list to snapshot keys in order to find local 
		//reference to contact; use that contact's setters to update the local reference
	  
	  	self.messageList.forEach(function(message, index){
			if(message.messageId === snapshot.key){
				self.messageList[index].setFirstName(snapshot.val().firstName);
				self.messageList[index].setLastName(snapshot.val().lastName);
				self.messageList[index].setEmails(snapshot.val().emails);
				self.messageList[index].setPicture(snapshot.val().picture);
				self.messageList[index].setPhoneNumbers(snapshot.val().phoneNumbers);
				self.messageList[index].setUserId(snapshot.val().userId);
				self.messageList[index].setStatus(snapshot.val().status);
				self.messageList[index].setAvailability(snapshot.val().availability);
			}
		});
	});
	
	
	
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
			settings: {mute:false}
		};
		
		
		newParticipants.forEach(function(participant){
			// add participant to chat-members
			firebase.database().ref().child('chat-members/' + self.chatId + "/" + participant).set(true).then(function(){
				updates = {};
				// add user-chat entry for participant
				updates['/user-chats/' + participant + "/" + self.chatId] = chatInfo;
				firebase.database().ref().update(updates);
			});
		});
	
		
	}
}

MercurioChat.prototype.deleteMessages = function(indices){

	var self = this;
	indices.forEach(function(index){
		firebase.database().ref('chat-messages/' + self.chatId + '/' + self.messageList[index].messageId).set(null);
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

MercurioChat.prototype.exitChatGroup = function(userId){

	var self = this;
	
	self.participantList.forEach(function(participant){
		updates = {};
		updates['/user-chats/' + participant.userId + "/" + self.chatId + '/participantCount'] = self.participantCount - 1;
		
		if(participant.userId === userId){
			updates['/chat-members/' + self.chatId + "/" + participant.userId] = false;
		}
		
		firebase.database().ref().update(updates);
	});
}