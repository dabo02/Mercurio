/*
uses MissingImplementationError

@constructor

*/

function MercurioChatClient(userId, messageReceivedObserver, chatAddedToListObserver){
	AbstractChatClient.apply(this, arguments);

}

MercurioChatClient.prototype = Object.create(AbstractChatClient.prototype);

MercurioChatClient.prototype.constructor = MercurioChatClient;

MercurioChatClient.prototype.fetchChatListChildChangedSnapshot = function(childChangedSnapshotCallback){

	firebase.database().ref('user-chats/' + this.chatClientOwner).orderByChild('type').equalTo('mercurio').on('child_changed', function(snapshot) {

		childChangedSnapshotCallback(snapshot);

	});
}

MercurioChatClient.prototype.fetchChatListChildAddedSnapshot = function(pageNumber, limit, childAddedSnapshotCallback){

	// fetch list of 50 most recent chats
	// TODO missing pagination and filters

	//empty out chatList to make room for it's updated copy
	this.chatList = [];

	firebase.database().ref('user-chats/' + this.chatClientOwner).orderByChild('type').equalTo('mercurio').on('child_added', function(snapshot) {

		childAddedSnapshotCallback(snapshot);

	});
}

MercurioChatClient.prototype.fetchChatListChildRemovedSnapshot = function(childRemovedSnapshotCallback){

	firebase.database().ref('user-chats/' + this.chatClientOwner).orderByChild('type').equalTo('mercurio').on('child_removed', function(snapshot) {

		childRemovedSnapshotCallback(snapshot);

	});

}

MercurioChatClient.prototype.getChatList = function(){
	return this.chatList;
}

MercurioChatClient.prototype.canCreateChatFromParticipants = function(userIds, phoneNumbers){

	if(phoneNumbers.length > 0 || userIds.length < 2){
		return false;
	}
	else{
		return true;
	}
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

MercurioChatClient.prototype.sendTextContentToParticipant = function(chat, participant, newMessageKey, message){

	this.propagateMessageInFirebase(chat, participant, newMessageKey, message);
}

MercurioChatClient.prototype.saveGroupPicture = function(picture, chat, sendUploadStatus){
	// TODO - upload picture to firebase and retrieve url to uploaded file

	var self = this;

	var updates = {};
	var uploadTask = firebase.storage().ref().child('chatGroup/' + chat.chatId + '/groupPicture/').put(picture);

	// Listen for state changes, errors, and completion of the upload.
	uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
		function(snapshot) {
			self.uploadingImage = true;
			// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
			var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
			if(progress<100){
				sendUploadStatus(progress, true);
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
			var updates = {};
			chat.participantList.forEach(function(participant){
				updates['user-chats/' + participant.participantId + '/' +chat.chatId +'/groupPicture'] = uploadTask.snapshot.downloadURL;
				firebase.database().ref().update(updates);
			})
			sendUploadStatus(100, false);
		});

	// TODO - add error management callback
}

MercurioChatClient.prototype.setChatType= function(chatInfo){
	chatInfo.type = 'mercurio';

	return;
}