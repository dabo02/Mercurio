/*
@constructor: Constructor for MissingImplementationError
@params: message - message to describe error
*/

function MissingImplementationError(message){
	this.message = message;
	this.name = "Missing Implementation Error";
}