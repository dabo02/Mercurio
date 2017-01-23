/*
uses ConstructorError, AbstractFunctionError
@constructor Constructor for AbstractChat class
@params: title - string containing title of chat
@params: participants - array containing a collection of particpants
*/

function AbstractChat(){

	if(this.constructor === AbstractChat){
		throw new ConstructorError("Cannot instantiate AbstractChat class!");
	}
	
	//check if parameter types are correct
	
	this.title;
	this.participants =[]; //array of participants
	this.messageList = [];
	this.chatSettings = [];
}

/*

Requests server to add a message to the chat list in database and updates its local copy
@method
@abstract
@params: messageInfo - message object to add to

*/

AbstractChat.prototype.addMessage = function(messageInfo){
	throw new AbstractFunctionError("Cannot call abstract function addMessage!");
}

/*

Requests server to delete a list of messages from the chat list in database
and updates its local copy.
@method
@abstract
@params: messageIndices - indices to messages in chat list array that identifies the 
messages to delete

*/
AbstractChat.prototype.deleteMessages = function(messageIndices){
	throw new AbstractFunctionError("Cannot call abstract function deleteMessages!");
}


AbstractChat.prototype.addParticipant = function(contact){
	throw new AbstractFunctionError("Cannot call abstract function addParticipant!");
}

AbstractChat.prototype.getParticipants = function(){
	throw new AbstractFunctionError("Cannot call abstract function getParticipants!");
}

