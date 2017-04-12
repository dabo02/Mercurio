/*
uses MissingImplementationError

@constructor

*/

function SMSChatClient(userId, messageReceivedObserver, chatAddedToListObserver){
	AbstractChatClient.apply(this, arguments);
}

SMSChatClient.prototype = Object.create(AbstractChatClient.prototype);

SMSChatClient.prototype.constructor = SMSChatClient;

SMSChatClient.prototype.fetchChatListChildChangedSnapshot = function(childChangedSnapshotCallback){
	firebase.database().ref('user-chats/' + this.chatClientOwner).orderByChild('type').equalTo('sms').on('child_changed', function(snapshot) {

		childChangedSnapshotCallback(snapshot);

	});
}

SMSChatClient.prototype.fetchChatListChildAddedSnapshot = function(pageNumber, limit, childAddedSnapshotCallback){

	// fetch list of 50 most recent chats
	// TODO missing pagination and filters

	//empty out chatList to make room for it's updated copy
	//this.chatList = [];

	firebase.database().ref('user-chats/' + this.chatClientOwner).orderByChild('type').equalTo('sms').on('child_added', function(snapshot) {

		childAddedSnapshotCallback(snapshot);

	});


	function binaryInsert(value, array, startVal, endVal){

		var length = array.length;
		var start = typeof(startVal) != 'undefined' ? startVal : 0;
		var end = typeof(endVal) != 'undefined' ? endVal : length - 1;//!! endVal could be 0 don't use || syntax
		var m = start + Math.floor((end - start)/2);

		if(length == 0){
			array.push(value);
			return;
		}

		if(value > array[end].lastMessage.timeStamp){
			array.splice(end + 1, 0, value);
			return;
		}

		if(value < array[start].lastMessage.timeStamp){//!!
			array.splice(start, 0, value);
			return;
		}

		if(start >= end){
			return;
		}

		if(value < array[m].lastMessage.timeStamp){
			binaryInsert(value, array, start, m - 1);
			return;
		}

		if(value > array[m].lastMessage.timeStamp){
			binaryInsert(value, array, m + 1, end);
			return;
		}

		//we don't insert duplicates
	}
}

SMSChatClient.prototype.fetchChatListChildRemovedSnapshot = function(childRemovedSnapshotCallback){

	firebase.database().ref('user-chats/' + this.chatClientOwner).orderByChild('type').equalTo('sms').on('child_removed', function(snapshot) {

		childRemovedSnapshotCallback(snapshot);

	});

}

SMSChatClient.prototype.getChatList = function(){
	return this.chatList;
}

SMSChatClient.prototype.canCreateChatFromParticipants = function(userIds, phoneNumbers){

	if(phoneNumbers.length != 1 || userIds.length != 1){
		return false;
	}
	else{
		return true;
	}
}

SMSChatClient.prototype.countChatDuplicatesWithParticipantPhoneNumbers = function(currentCount, phoneNumberParticipants, existingChatMember){

	for(var i = 0; i < phoneNumberParticipants.length; i++){
		if(existingChatMember == phoneNumberParticipants[i]){
			currentCount++;
		}
	}

	return currentCount;
}

SMSChatClient.prototype.addParticipantsToChatWithPhoneNumbers = function(newChatKey, phoneNumber){

	firebase.database().ref().child('chat-members/' + newChatKey + "/" + phoneNumber).set(true);

	return;
}

SMSChatClient.prototype.instantiateChat = function(chatSnapshot){
	return new SMSChat(chatSnapshot.key, chatSnapshot.val().participantCount, self.participantsAreReadyObserver,
		chatSnapshot.val().lastMessage, chatSnapshot.val().settings, chatSnapshot.val().timeStamp, chatSnapshot.val().title, this.chatClientOwner);
}


SMSChatClient.prototype.setChatListObserver = function(observer){
	this.chatListIsReadyObserver = observer;
}

SMSChatClient.prototype.sendTextContentToParticipant = function(chat, participant, newMessageKey, message){

	if(participant.constructor.name == 'SMSChatParticipant'){
		//propagate message in sms network
	}
	else{
		this.propagateMessageInFirebase(chat, participant, newMessageKey, message);
	}

}

SMSChatClient.prototype.setChatType= function(chatInfo){
	chatInfo.type = 'sms';

	return;
}
