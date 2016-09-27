/*
uses AbstractContact, MissingImplementationError
@constructor: Constructor for Contact class
@params: firstName - String
		 lastName - String
		 email - String
		 picture - String
		 phoneNumbers - Array of Strings
		 userId - mercurio user id
		 status - mercurio status
		 availability - mercurio availability
*/

function Contact(firstName, lastName, email, picture, phoneNumbers, userId, status, availability){
	
	AbstractContact.apply(this, arguments);
}

Contact.prototype = Object.create(AbstractContact.prototype);

Contact.prototype.constructor = Contact;

/*

Requests server to add a contact to the database and updates its local copy
@method
@abstract
@params: firstName - String
		 lastName - String
		 email - String
		 picture - String
		 phoneNumbers - Array of Strings

*/

Contact.prototype.saveContact = function(firstName, lastName, email, picture, phoneNumbers){
	//set all instance fileds with parameters and save to firebase
	throw new MissingImplementationError("Function saveContact(firstName, lastName, email, picture, phoneNumbers) is missing it's implementation!");
}