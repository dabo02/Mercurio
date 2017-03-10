/*
uses AbstractContactManager, MercurioContact, Contact, MissingImplementationError
@constructor
*/

function MercurioContactManager(userId){

	var self = this;
	self.contactObserver = undefined;

	AbstractContactManager.apply(self, arguments);

	//check if parameter types are correct
	self.contactListQuery = firebase.database().ref('user-contacts/' + userId).on("child_added", function(snapshot) {

		if(snapshot.exists()){

			var contact;
			contact = new MercurioContact(snapshot.val().firstName, snapshot.val().lastName,
			snapshot.val().email, snapshot.val().picture, snapshot.val().phone, snapshot.val().extension,
			snapshot.key, snapshot.val().userId, snapshot.val().status, snapshot.val().availability);

			self.contactList.push(contact);
		}

	});

	firebase.database().ref('user-contacts/' + userId).on('child_changed', function(snapshot) {
	  	//compare contact ids from local contact list to snapshot keys in order to find local
		//reference to contact; use that contact's setters to update the local reference

	  	self.contactList.forEach(function(contact, index){
			if(contact.contactId === snapshot.key){
				self.contactList[index].setFirstName(snapshot.val().firstName);
				self.contactList[index].setLastName(snapshot.val().lastName);
				self.contactList[index].setEmails(snapshot.val().emails);
				self.contactList[index].setPicture(snapshot.val().picture);
				self.contactList[index].setPhoneNumbers(snapshot.val().phone);
				self.contactList[index].setExtensions(snapshot.val().extension);
				self.contactList[index].setUserId(snapshot.val().userId);
				self.contactList[index].setStatus(snapshot.val().status);
				self.contactList[index].setAvailability(snapshot.val().availability);
			}
		});

		if(self.contactObserver()){
					self.contactObserver();
				}

	});

	firebase.database().ref('user-contacts/' + userId).on('child_removed', function(snapshot) {

		//compare contact ids from local contact list to snapshot keys in order to find local
		//reference to contact; remove contact from local contacts list

		self.contactList.forEach(function(contact, index){
			if(contact.contactId === snapshot.key){
				self.contactList.splice(index, 1);
			}
		});
	});
}

MercurioContactManager.prototype = Object.create(AbstractContactManager.prototype);

MercurioContactManager.prototype.constructor = MercurioContactManager;

/*

*/
MercurioContactManager.prototype.addContact = function(userId, contactInfo){

	var newContactKey = firebase.database().ref().child('user-contacts/' + userId).push().key;

	//determine if contact number belongs to a mercurio user and if so find that user's id
	//before updating the new contact's attributes in firebase

	var updates = {};
	updates['/user-contacts/' + userId + "/" + newContactKey] = contactInfo;

	firebase.database().ref().update(updates);
}

MercurioContactManager.prototype.getContact = function(index){

	return this.contactList[index];
}

MercurioContactManager.prototype.getContactList = function(index){

	return this.contactList;
}

MercurioContactManager.prototype.setContactObserver = function(contactObserver){
	this.contactObserver = contactObserver;
}

MercurioContactManager.prototype.deleteContacts = function(userId, indices){

	var self = this;
	indices.forEach(function(index){
		firebase.database().ref('user-contacts/' + userId + '/' + self.contactList[index].contactId).set(null);
	});
}

/*

Requests server to add a contact to the database and updates its local copy
@method
@abstract
@params: userId - String
@params: contactInfo - object containing info to save
*/

MercurioContactManager.prototype.updateContact = function(userId, index, contactInfo){

	var updates = {};
	updates['/user-contacts/' + userId + "/" + this.contactList[index].contactId] = contactInfo;

	firebase.database().ref().update(updates);
}

MercurioContactManager.prototype.searchContacts = function(searchTerm){

	var self = this;
	var searchResults = [];

	self.contactList.forEach(function(contact){
		if(contact.firstName.indexOf(searchTerm) >= 0){
			searchResults.push(contact);
		}
		else if(contact.lastName.indexOf(searchTerm) >= 0){
			searchResults.push(contact);
		}
		else if(contact.phone.indexOf(searchTerm) >= 0){
			searchResults.push(contact);
		}
	});

	return searchResults;
}
