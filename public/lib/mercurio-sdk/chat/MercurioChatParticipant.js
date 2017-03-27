/*
@constructor
@params: title - string containing title of message
@params: participants - array containing a collection of particpants
*/


function MercurioChatParticipant(participantId, participantReadyCallback){
	
	var self = this;

	self.firstName = '';
	self.lastName = '';
	self.email = '';
	self.picture = '';
	self.phone = '';
	self.availability = '';
	self.participantId = '';


	firebase.database().ref('account/' + participantId).on('value', function(snapshot) {

		if(snapshot.exists()){
			self.initializeParticipant(snapshot);
		}

		participantReadyCallback(self);
	});
}

MercurioChatParticipant.prototype.initializeParticipant = function(snapshot){

	var self = this;

	self.firstName = snapshot.val().firstName;
	self.lastName = snapshot.val().lastName;
	self.email = snapshot.val().email;
	self.picture = snapshot.val().picture;
	self.phone = snapshot.val().phone;
	self.availability = snapshot.val().availability;
	self.participantId = snapshot.key;
}