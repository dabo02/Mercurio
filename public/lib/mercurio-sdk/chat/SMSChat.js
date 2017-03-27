/*
@constructor
@params: title - string containing title of message
@params: participants - array containing a collection of particpants
*/

function SMSChat(chatId, participantCount, participantsAreReadyObserver,
	lastMessage, settings, timeStamp, title, chatClientOwner){

	AbstractChat.apply(this,arguments);
}

SMSChat.prototype = Object.create(AbstractChat.prototype);

SMSChat.prototype.constructor = SMSChat;

SMSChat.prototype.instantiateParticipant = function(chatClientOwner, participantId, participantIsReadyCallback){

	if(isNaN(participantId)){
		new MercurioChatParticipant(participantId, participantIsReadyCallback);
	}
	else{
		new SMSChatParticipant(chatClientOwner, participantId, participantIsReadyCallback);
	}
}

SMSChat.prototype.getMessageList = function(){
	return this.messageList;
}

SMSChat.prototype.saveChatTitleWithParticipant = function(chatId, participantId, newChatTitle){

	self.updateChatTitleInFirebase(chatId, participantId, newChatTitle);
}

SMSChat.prototype.addParticipantsWithPhoneNumbersToList = function(phoneNumbers, newParticipants){

	var self = this;
	phoneNumbers.forEach(function(participant){
		self.addParticipantToList(participant.participantId, newParticipants);
	});

	return;
}

SMSChat.prototype.updateParticipantCount = function(participantId, count){

	if(isNaN(participantId)){
		var updates = {};
		updates['/user-chats/' + participantId + "/" + chatId + '/participantCount'] = count;
		firebase.database().ref().update(updates);
		return;
	}
	else{
		return;
	}

}

SMSChat.prototype.addUserChatEntryToNewParticipant = function(participantId, newParticipantCount){

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

//falta
SMSChat.prototype.exitChatGroup = function(userId){

	var self = this;
	
	self.participantList.forEach(function(participant){
		var updates = {};
		updates['/user-chats/' + participant.participantId + "/" + self.chatId + '/participantCount'] = self.participantCount - 1;
		
		if(participant.participantId === userId){
			updates['/chat-members/' + self.chatId + "/" + participant.participantId] = false;
		}
		
		firebase.database().ref().update(updates);
	});
}