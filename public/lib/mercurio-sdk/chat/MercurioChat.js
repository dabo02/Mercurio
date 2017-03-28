/*
@constructor
@params: title - string containing title of message
@params: participants - array containing a collection of particpants
*/

function MercurioChat(chatId, participantCount, participantsAreReadyObserver,
	lastMessage, settings, timeStamp, title, chatClientOwner, groupPicture){

	AbstractChat.apply(this,arguments);
}

MercurioChat.prototype = Object.create(AbstractChat.prototype);

MercurioChat.prototype.constructor = MercurioChat;

MercurioChat.prototype.instantiateParticipant = function(chatClientOwner, participantId, participantIsReadyCallback){

	new MercurioChatParticipant(participantId, participantIsReadyCallback);
}

MercurioChat.prototype.getMessageList = function(){
		
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


MercurioChat.prototype.addUserChatEntryToNewParticipant = function(participantId, newParticipantCount){

	var chatInfo = {
		lastMessage: {},
		timeStamp: new Date().getTime(),
		title: self.title || '',
		participantCount: newParticipantCount,
		settings: {mute:false},
		groupPicture: self.groupPicture || ''
	};

	var updates = {};

	firebase.database().ref('user-chats/' + participantId + "/" + self.chatId).once("value", function(snapshot){
		if(snapshot.exists()){
			chatInfo.lastMessage = snapshot.val()['lastMessage'];
		}
		updates = {};
		// add user-chat entry for participant
		updates['/user-chats/' + participantId + "/" + self.chatId] = chatInfo;
		firebase.database().ref().update(updates);
	});
}

MercurioChat.prototype.toggleIsTyping = function(value, chatClientOwner){
	var self = this;
	var updates = {};
	updates['/chat-members/' + self.chatId +'/' + chatClientOwner + '/isTyping' ] = value;
	firebase.database().ref().update(updates);
}

MercurioChat.prototype.deleteMessages = function(messages, chatClientOwner){

	var self = this;
	messages.forEach(function(message){
		firebase.database().ref('message-info/' + message + '/has-message/' + chatClientOwner).set(false);
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
		updates['/user-chats/' + participant.participantId + "/" + self.chatId + '/participantCount'] = self.participantCount - 1;

		if(participant.participantId === participantId){
			updates['/chat-members/' + self.chatId + "/" + participantId + '/isMember'] = false;
			updates['/chat-members/' + self.chatId + "/" + participantId + '/isAdmin'] = false;
		}

		firebase.database().ref().update(updates);
	});
}