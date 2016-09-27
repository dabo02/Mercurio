/*

uses ConstructorError, AbstractFunctionError

@constructor: Constructor for AbstractChatClient
@abstract
@params: notificationManager - NotificationManager object singleton
*/

function AbstractChatClient(){
	
	if(this.constructor === AbstractChatClient){
		throw new ConstructorError("Cannot instantiate AbstractChatClient class!");
	}
	
	//check if parameter types are correct
	
	this.notificationManager;
	this.chatList = [];
	this.chatSettings = [];

}

/*
Requests server to add a chat to the database
@method
@abstract
@params: chat - Chat object
*/

AbstractChatClient.prototype.addChat = function(chat){
	throw new AbstractFunctionError("Cannot call abstract function addChat!");
}

/*
Requests server to delete a list of chats from the database
@method
@abstract
@params: chatIndexes - integer array containing indexes of chats to remove from recent chats
*/

AbstractChatClient.prototype.deleteChats = function(chatIndexes){
	throw new AbstractFunctionError("Cannot call abstract function deleteChats!");
}

/*
Requests server to search for a filtered a list of chats from the database
@method
@abstract
@params: searchString - string filter to apply to search

*/

AbstractChatClient.prototype.searchChats = function(searchString){
	throw new AbstractFunctionError("Cannot call abstract function searchChats!");
}

/*
Establishes a connection for sending and receiving messages between server and client
@method
@abstract
@params: account - AbstractAccount object containing info about the connecting user
*/

AbstractChatClient.prototype.connect = function(account){
	throw new AbstractFunctionError("Cannot call abstract function connect!");
}

/*
Tears down a connection for sending and receiving messages between server and client
@method
@abstract
@params: account - AbstractAccount object containing info about the connecting user
*/

AbstractChatClient.prototype.disconnect = function(account){
	throw new AbstractFunctionError("Cannot call abstract function disconnect!");
}

/*
Sends a chat message to server
@method
@abstract
@params: chatIndex - index of the recent chat to which the send message belongs to
		 message - AbstractMessage object
*/

AbstractChatClient.prototype.sendMessage = function(chatIndex, message){
	throw new AbstractFunctionError("Cannot call abstract function sendMessage!");
}

/*
Receives a chat message from server, instantiates the appropriate concrete message object,
and adds it to its corresponding recent chat
@method
@abstract
@params: chatIndex - index of the recent chat to which the send message belongs to
		 type - string containing type of concrete message to receive
		 messageContent - JSON object containing the received message's content
		 
messageContent must be structured as shown below:

*** JSON example of messageContent here ***
*/

AbstractChatClient.prototype.receiveMessage = function(chatIndex, type, messageContent){
	throw new AbstractFunctionError("Cannot call abstract function receiveMessage!");
}