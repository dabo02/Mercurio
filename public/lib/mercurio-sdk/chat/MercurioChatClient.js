/*
uses MissingImplementationError

@constructor

*/

function MercurioChatClient(userId, messageReceivedObserver){
	AbstractChatClient.apply(this, arguments);
}

MercurioChatClient.prototype = Object.create(AbstractChatClient.prototype);

MercurioChatClient.prototype.constructor = MercurioChatClient;

MercurioChatClient.prototype.fetchChatListChildChangedSnapshot = function(childChangedSnapshotCallback){

	firebase.database().ref('user-chats/' + this.chatClientOwner).orderByChild('type').equalTo('im').on('child_changed', function(snapshot) {

		childChangedSnapshotCallback(snapshot);

	});
}

MercurioChatClient.prototype.fetchChatListChildAddedSnapshot = function(pageNumber, limit, childAddedSnapshotCallback){

	// fetch list of 50 most recent chats
	// TODO missing pagination and filters

	//empty out chatList to make room for it's updated copy
	this.chatList = [];

	firebase.database().ref('user-chats/' + this.chatClientOwner).on('child_added', function(snapshot) {

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

MercurioChatClient.prototype.fetchChatListChildRemovedSnapshot = function(childRemovedSnapshotCallback){

	firebase.database().ref('user-chats/' + this.chatClientOwner).orderByChild('type').equalTo('im').on('child_removed', function(snapshot) {

		childRemovedSnapshotCallback(snapshot);

	});

}

MercurioChatClient.prototype.getChatList = function(){
	return this.chatList;
}

MercurioChatClient.prototype.countChatDuplicatesWithParticipantPhoneNumbers = function(currentCount, phoneNumberParticipants, existingChatMember){

	return currentCount;
}

MercurioChatClient.prototype.addParticipantsToChatWithPhoneNumbers = function(newChatKey, phoneNumberParticipants){

	return;
}

MercurioChatClient.prototype.instantiateChat = function(chatSnapshot){
	return new MercurioChat(chatSnapshot.key, chatSnapshot.val().participantCount, this.participantsAreReadyObserver,
		chatSnapshot.val().lastMessage, chatSnapshot.val().settings, chatSnapshot.val().timeStamp, chatSnapshot.val().title, this.chatClientOwner);
}


MercurioChatClient.prototype.setChatListObserver = function(observer){
	this.chatListIsReadyObserver = observer;
}

MercurioChatClient.prototype.sendTextContentToParticipant = function(chat, participant, newMessageKey, message){

	this.propagateMessageInFirebase(chat, participant, newMessageKey, message);
}

