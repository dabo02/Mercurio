/*
uses AbstractContact, MissingImplementationError
@constructor: Constructor for MercurioContact class
@params: firstName - String
		 lastName - String
		 emails - array
		 picture - String
		 phoneNumbers - Array 
		 userId - mercurio user id
		 status - mercurio status
		 availability - mercurio availability
*/

function MercurioContact(){
	
	this.userId;
	this.status;
	this.availability;
	this.contactId;
}

function MercurioContact(firstName, lastName, emails, picture, phone, userId, status, availability, contactId){
	
	AbstractContact.apply(this, arguments);
	
	//add status and availability
	//check for input parameter type correctness :)
	this.userId = userId;
	this.status = status;
	this.availability = availability;
	this.contactId = contactId;
}

MercurioContact.prototype = Object.create(AbstractContact.prototype);

MercurioContact.prototype.constructor = MercurioContact;

/*

Requests server to add a contact to the database and updates its local copy
@method
@abstract
@params: firstName - String
		 lastName - String
		 emails - array
		 picture - String
		 phoneNumbers - Array of Strings

*/

MercurioContact.prototype.setUserId = function(userId){
	this.userId = userId;
}

MercurioContact.prototype.setStatus = function(status){
	this.status = status;
}

MercurioContact.prototype.setAvailability = function(availability){
	this.availability = availability;
}