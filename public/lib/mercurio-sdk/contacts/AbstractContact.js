/*
@constructor: Constructor for AbstractContact class
@abstract
@params: firstName - String
		 lastName - String
		 emails - array
		 picture - String
		 phoneNumbers - Array
*/

function AbstractContact(firstName, lastName, emails, picture, phone, extension){
	
	if(this.constructor === AbstractContact){
		throw new ConstructorError("Cannot instantiate AbstractContact class!");
	}
	
	//check if parameter types are correct
	
	this.firstName = firstName;
	this.lastName = lastName;
	this.email = emails;
	this.picture = picture;
	
	// check if phoneNumbers is array
	this.phone = phone;
	this.extension = extension;
	
	this.contactSettings = [];
}

AbstractContact.prototype.setFirstName = function(firstName){
	this.firstName = firstName;
}

AbstractContact.prototype.setLastName = function(lastName){
	this.lastName = lastName;
}

AbstractContact.prototype.setEmails = function(emails){
	this.emails = emails;
}

AbstractContact.prototype.setPicture = function(picture){
	this.picture = picture;
}

AbstractContact.prototype.setPhoneNumbers = function(phoneNumbers){
	this.phoneNumbers = phoneNumbers;
}

AbstractContact.prototype.setExtensions = function(extensions){
	this.phoneNumbers = extensions;
}
