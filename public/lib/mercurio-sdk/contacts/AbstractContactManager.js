/*
uses uses ConstructorError, AbstractFunctionError

@constructor: Constructor for AbstractContactManager class
@abstract
*/

function AbstractContactManager(){

	if(this.constructor === AbstractAccount){
		throw new ConstructorError("Cannot instantiate AbstractContactManager class!");
	}
	
	this.contactList = [];
}

AbstractContactManager.prototype.addContact = function(userId, contactInfo){
	throw new AbstractFunctionError("Cannot call abstract function addContact!");
}

AbstractContactManager.prototype.deleteContacts = function(indices){
	throw new AbstractFunctionError("Cannot call abstract function deleteContacts!");
}

AbstractContactManager.prototype.searchContacts = function(searchFilter){
	throw new AbstractFunctionError("Cannot call abstract function searchContacts!");
}