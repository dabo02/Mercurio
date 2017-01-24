/*
uses MissingImplementationError

@constructor

*/

function MercurioChatClient(userId, messageReceivedObserver){
	
	var self = this;
	self.chatList = [];
	self.chatClientOwner = userId;
	self.messageReceivedObserver = messageReceivedObserver;
	
	var pageNumber = 1;
	var limit = 50;
	
	firebase.database().ref('user-chats/' + self.chatClientOwner).orderByChild('lastMessage/timeStamp').on('child_changed', function(snapshot) {
	  	//compare contact ids from local contact list to snapshot keys in order to find local 
		//reference to contact; use that contact's setters to update the local reference
	  
	  	var chatFound = false;
	  	self.chatList.forEach(function(chat, index){
			if(chat.chatId === snapshot.key){
			
				chatFound = true;
				
				chat.settings = snapshot.val().settings;
				chat.timeStamp = snapshot.val().timeStamp;
				chat.title = snapshot.val().title;
				chat.participantCount = snapshot.val().participantCount;
					
				if(!snapshot.val().lastMessage){
					self.chatList.splice(index, 1);
				}
				else{
				
					if(!chat.lastMessage || chat.lastMessage.timeStamp != snapshot.val().lastMessage.timeStamp){
			
						chat.lastMessage = snapshot.val().lastMessage;
						// self.chatList.sort(function(a, b){
	// 						if(!b.lastMessage || !a.lastMessage){
	// 							return 0;
	// 						}
	// 						else{
	// 							return b.lastMessage.timeStamp - a.lastMessage.timeStamp;
	// 						}
	// 					});
					
						self.chatList.splice(index, 1);
						self.chatList.unshift(chat);
					
						// call observer to notify view that a new chat message has been received
						self.messageReceivedObserver(chat, index);					
					}
				}
			}
		});
		
		if(!chatFound){
			self.fetchChatListPage(pageNumber, limit);
		}
	}); 
	
	self.fetchChatListPage(pageNumber, limit);
}

MercurioChatClient.prototype.getChatList = function(){
	return this.chatList;
}

MercurioChatClient.prototype.fetchChatListPage = function(pageNumber, limit){

	var self = this;
	
	//empty out chatList to make room for it's updated copy
	self.chatList = [];
	
	// fetch list of 50 most recent chats
	// TODO missing pagination and filters
	
	firebase.database().ref('user-chats/' + self.chatClientOwner).orderByChild('lastMessage/timeStamp').limitToFirst(1 * pageNumber * limit).on("child_added", function(snapshot) {
	
		//if(snapshot.val().lastMessage != undefined){
		
			var chat;
			// send observer callback registered in addChat to MercurioChat constructor
			//if(snapshot.val().lastMessage){
				//chat = new MercurioChat(snapshot.key, snapshot.val().participantCount);
			//}
			chat = new MercurioChat(snapshot.key, snapshot.val().participantCount, self.participantsAreReadyObserver,
					snapshot.val().lastMessage, snapshot.val().settings, snapshot.val().timeStamp, snapshot.val().title, self.chatClientOwner);
			
			self.chatList.unshift(chat);
		//}

	});
	
	firebase.database().ref('user-chats/' + self.chatClientOwner).orderByChild('lastMessage/timeStamp').limitToFirst(pageNumber * limit).on('child_removed', function(snapshot) {
	
		//compare chat ids from local chat list to snapshot keys in order to find local 
		//reference to chat; remove chat from local contacts list

		self.chatList.forEach(function(chat, index){
			if(chat.chatId === snapshot.key){
				self.chatList.splice(index, 1);
			}
		});
	});
}

/*
Requests server to create a chat and add it to the database
@method
@params: chatInfo - JSON object with chat attributes (including participantCount)
*/

MercurioChatClient.prototype.createChat = function(title, contacts, observer){

	var self = this;
	var participants = [];

	contacts.forEach(function(contact){
		if(contact.userId != '' || contact.userId !== undefined){
			// contact is a mercurio user
			participants.push(contact.userId);
		}
	});

	participants.push(self.chatClientOwner);
	
	if(participants.length > 1){
		// chat client owner is not the only participant in the list
		
		// receive observer call back in addChat parameters and register the callback to this
		//self.participantsAreReadyObserver = observer;
	
		var newChatRef = firebase.database().ref().child('user-chats/' + self.chatClientOwner).push();
		var newChatKey = newChatRef.key;
	
		var chatInfo = {
			lastMessage: {},
			timeStamp: new Date().getTime(),
			title: title || '',
			participantCount: participants.length,
			settings: {mute:false}
		};
		
		var updates = {};
				
		participants.forEach(function(participant){
			// add participant to chat-members
			firebase.database().ref().child('chat-members/' + newChatKey + "/" + participant).set(true).then(function(){
				updates = {};
				// add user-chat entry for participant
				updates['/user-chats/' + participant + "/" + newChatKey] = chatInfo;
				firebase.database().ref().update(updates);
			});
		});
	}
	
	observer();
	
	/* buggy code for avoiding duplicate non-group chats
	var existingParticipants = [];
	if(participants.length === 2){
		firebase.database().ref('user-chats/' + self.chatClientOwner).once('child_added', function(outerSnapshot){
			if(outerSnapshot.val().participantCount == 2){
				firebase.database().ref('chat-members/' + outerSnapshot.key).once('child_added', function(innerSnapshot){
					existingParticipants.push(innerSnapshot.key);
				}).then(function(){
					var matchedParticipantCount = 0;
					existingParticipants.forEach(function(existingParticipant){
						if(participants.indexOf(existingParticipant) > -1){
							matchedParticpantCount++;
						}
					});
					if(matchedParticipantCount === 2){
						return; //chat already exists
					}
				});
			}
		});
	}*/
}

/*
Requests server to delete a list of chats from the database
@method
@params: indexes - integer array containing indexes of chats to remove from recent chats
*/

MercurioChatClient.prototype.deleteChats = function(indices){
	var self = this;
	indices.forEach(function(index){
		firebase.database().ref('user-chats/' + self.chatClientOwner + '/' + self.chatList[index].chatId + '/lastMessage').set(null);
		firebase.database().ref('user-chats/' + self.chatClientOwner + '/' + self.chatList[index].chatId + '/timeStamp').set(0);
	});
}

/*
Requests server to search for a filtered a list of chats from the database
@method
@params: searchString - string filter to apply to search
*/

MercurioChatClient.prototype.searchChats = function(searchString){
	throw new MissingImplementationError("Function searchChats(searchString) is missing it's implementation!");
}

/*
Sends a chat message to server
@method
@params: chatIndex - index of the recent chat to which the send message belongs to
		 message - AbstractMessage object
*/

MercurioChatClient.prototype.sendMultimediaMessage = function(chatIndex, message){

	var self = this;
		
	if(!message.multimediaUrl){
		message.multimediaUrl = "";
	}
	
	var newMessageKey = self.chatList[chatIndex].addMessage(message);
	
	if(message.multimediaUrl){
		firebase.storage().ref().child('chats/' + self.chatList[chatIndex].chatId + '/images/' + newMessageKey).put(message.multimediaUrl)
		.then(function(multimediaSnapshot) {

			message.multimediaUrl = multimediaSnapshot.downloadURL;

			var updates = {};
			updates['/chat-messages/' + self.chatList[chatIndex].chatId + "/" + newMessageKey + "/multimediaUrl"] = message.multimediaUrl;

			firebase.database().ref().update(updates);
			
			self.sendTextMessage(chatIndex, newMessageKey, message);
		});
	}
	else{

		self.sendTextMessage(chatIndex, newMessageKey, message);
	}
	
}

MercurioChatClient.prototype.sendTextMessage = function(chatIndex, newMessageKey, message){

	var self = this;
		
	firebase.database().ref().child('message-info/' + newMessageKey + "/read/" + self.chatClientOwner).set(message.timeStamp);

	var iOSTokens = [];

	self.chatList[chatIndex].participantList.forEach(function(participant){

		if(participant.userId !== self.chatClientOwner){
			firebase.database().ref().child('message-info/' + newMessageKey + "/read/" + participant.userId).set(0);
		}

		firebase.database().ref().child('user-tokens/' + participant.userId).once('child_added', function(snapshot){
			iOSTokens.push(snapshot.key);
		});

		firebase.database().ref().child('message-info/' + newMessageKey + "/has-message/" + participant.userId).set(true);

		var updates = {};
		message.messageId = newMessageKey;

		updates['/user-chats/' + participant.userId + "/" + self.chatList[chatIndex].chatId + "/lastMessage"] = message;

		firebase.database().ref().update(updates);
	});

	iOSTokens.forEach(function(token){
		// this may run before all tokens are fetched :( maybe i should delay a few seconds..?
		// curl with token to send push notification
	});

	// var chat = self.chatList[chatIndex];
// 	self.chatList.splice(chatIndex, 1);
// 	self.chatList.unshift(chat);
}

/*
Receives a chat message from server, instantiates the appropriate concrete message object,
and adds it to its corresponding recent chat
@method
@params: chatIndex - index of the recent chat to which the send message belongs to
@params: type - string containing type of concrete message to receive
@params: message - JSON object containing the received message's content
		 
messageContent must be structured as shown below:

*** JSON example of message here ***

*/

MercurioChatClient.prototype.receiveMessage = function(chatIndex, type, message){

	//service worker probably goes here..
	throw new MissingImplementationError("Function receiveMessage(chatIndex, type, messageContent) is missing it's implementation!");
}