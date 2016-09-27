/*
@constructor
@params: title - string containing title of message
@params: participants - array containing a collection of particpants
*/

function MercurioChat(chatId, participantCount, participantsAreReadyObserver,
	lastMessage, settings, timeStamp, title){
	
	var self = this;
	self.chatId = chatId;
	self.lastMessage = lastMessage;
	self.chatSettings = settings;
	self.timeStamp = timeStamp;
	self.title = title;
	self.participantList =[]; //array of participants
	self.messageList = [];
	self.participantCount;
	
	firebase.database().ref('chat-members/' + self.chatId).on('child_added', function(snapshot) {
	
		if(snapshot.exists()){
			
			var participant = new MercurioChatParticipant(snapshot.key, function(participant){
				self.participantList.push(participant);
				if(self.participantList.length === participantCount){
					if(participantsAreReadyObserver){
						participantsAreReadyObserver(self);
					}
				}
			});	
		}
	});
	
	firebase.database().ref('chat-members/' + self.chatId).on('child_removed', function(snapshot) {
	
		//compare message ids from local message list to snapshot keys in order to find local 
		//reference to message; remove message from local contacts list

		self.participants.forEach(function(participant, index){
			if(participant.participantId === snapshot.key){
				self.participantList.splice(index, 1);
			}
		});
	});
	
	var pageNumber = 1;
	var limit = 50;

	self.fetchMessageListPage(pageNumber, limit)
}

MercurioChat.prototype.getMessageList = function(){
	return this.messageList;
}

MercurioChat.prototype.fetchMessageListPage = function(pageNumber, limit){

	var self = this;
	
	//empty out messageList to make room for it's updated copy
	self.messageList = [];
	
	// fetch list of 50 most recent chats
	// TODO missing pagination and filters
	
	firebase.database().ref('chat-messages/' + self.chatId).limitToFirst(1 * pageNumber * limit).on("child_added", function(snapshot) {
	
		if(snapshot.exists()){
			var message;
			message = new Message(snapshot.key, snapshot.val().from, snapshot.val().multimediaUrl, snapshot.val().textContent, snapshot.val().timeStamp);
			self.messageList.push(message);
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

MercurioChat.prototype.addParticipant = function(participantId){

	firebase.database().ref().child('chat-members/' + this.chatId + "/" + participantId).set(true);

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

