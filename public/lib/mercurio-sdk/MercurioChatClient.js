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
			
				chat.chatSettings = snapshot.val().settings;
				chat.timeStamp = snapshot.val().timeStamp;
				chat.title = snapshot.val().title;
					
				if(chat.lastMessage !== snapshot.val().lastMessage){
			
					chat.lastMessage = snapshot.val().lastMessage;
					self.chatList.sort(function(a, b){
						return b.lastMessage.timeStamp - a.lastMessage.timeStamp
					});
					// call observer to notify view that a new chat message has been received
					self.messageReceivedObserver(chat.lastMessage);					
				}
				chatFound = true;
				
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
	
		if(snapshot.exists()){
		
			var chat;
			// send observer callback registered in addChat to MercurioChat constructor
			//if(snapshot.val().lastMessage){
				//chat = new MercurioChat(snapshot.key, snapshot.val().participantCount);
			//}
			chat = new MercurioChat(snapshot.key, snapshot.val().participantCount, self.participantsAreReadyObserver,
					snapshot.val().lastMessage, snapshot.val().settings, snapshot.val().timeStamp, snapshot.val().title);
			
			self.chatList.unshift(chat);
		}

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

MercurioChatClient.prototype.createChat = function(chatInfo, participants, observer){

	var self = this;
	
	// receive observer call back in addChat parameters and register the callback to this
	self.participantsAreReadyObserver = observer;
	
	var newChatRef = firebase.database().ref().child('user-chats/' + self.chatClientOwner).push();
	var newChatKey = newChatRef.key;
	newChatRef.set(chatInfo).then(function(){
		participants.forEach(function(participant){
			firebase.database().ref().child('chat-members/' + newChatKey + "/" + participant).set(true).then(function(){
				var updates = {};
				updates['/user-chats/' + participant + "/" + newChatKey] = chatInfo;
				firebase.database().ref().update(updates);
			});
		});
	});
	
	// add participants using the new chat key
}

/*
Requests server to delete a list of chats from the database
@method
@params: indexes - integer array containing indexes of chats to remove from recent chats
*/

MercurioChatClient.prototype.deleteChats = function(indices){
	var self = this;
	indices.forEach(function(index){
		firebase.database().ref('user-chats/' + self.chatClientOwner + '/' + self.chatList[index].chatId).set(null);
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
Establishes a connection for sending and receiving messages between server and client
@method
@params: account - AbstractAccount object containing info about the connecting user
*/

MercurioChatClient.prototype.connect = function(account){
	throw new MissingImplementationError("Function connect(account) is missing it's implementation!");
}

/*
Tears down a connection for sending and receiving messages between server and client
@method
@params: account - AbstractAccount object containing info about the connecting user
*/

MercurioChatClient.prototype.disconnect = function(account){
	throw new MissingImplementationError("Function disconnect(account) is missing it's implementation!");
}

/*
Sends a chat message to server
@method
@params: chatIndex - index of the recent chat to which the send message belongs to
		 message - AbstractMessage object
*/

MercurioChatClient.prototype.sendMessage = function(chatIndex, message){

	var self = this;
	
	var newMessageKey = self.chatList[chatIndex].addMessage(message);
	
	firebase.database().ref().child('message-info/' + newMessageKey + "/read/" + self.chatClientOwner).set(message.timeStamp);
	
	self.chatList[chatIndex].participantList.forEach(function(participant){
		
		if(participant.userId !== self.chatClientOwner){
			firebase.database().ref().child('message-info/' + newMessageKey + "/read/" + participant.userId).set(0);
		}
		
		firebase.database().ref().child('message-info/' + newMessageKey + "/has-message/" + participant.userId).set(true);
		
		var updates = {};
		updates['/user-chats/' + participant.userId + "/" + self.chatList[chatIndex].chatId + "/lastMessage"] = message;

		firebase.database().ref().update(updates);
	});
}

MercurioChatClient.prototype.markAllMessagesAsRead = function(chatIndex){

	var self = this;
	
	self.chatList[chatIndex].messageList.forEach(function(message){
		if(message.read[self.chatClientOwner] == 0){
			firebase.database().ref().child('message-info/' + message.messageId + "/read/" + self.chatClientOwner).set(new Date().getTime());
		}
	});
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