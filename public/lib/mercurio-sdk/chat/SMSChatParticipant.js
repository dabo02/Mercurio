/*
@constructor
@params: title - string containing title of message
@params: participants - array containing a collection of particpants
*/

/*

******************************************
*  Implements the Participant interface  *
*  getParticipantId();                   *
******************************************

*/



function SMSChatParticipant(chatClientOwner, participantId, participantReadyCallback){

	var self = this;

	self.firstName = '';
	self.lastName = '';
	self.picture = '';
	self.phone = '';
	self.participantId = '';


	firebase.database().ref('user-contacts/' + chatClientOwner).orderByChild('phone').equalTo(participantId).on('value', function(snapshot) {


		self.initializeParticipant(snapshot, participantId);

		participantReadyCallback(self);
	});
}

SMSChatParticipant.prototype.initializeParticipant = function(snapshot, participantId){

	var self = this;

	if(snapshot.val()){
		self.firstName = snapshot.val().firstName;
		self.lastName = snapshot.val().lastName;
		self.email = snapshot.val().email;
		self.picture = snapshot.val().picture;
		self.phone = snapshot.val().phone;
		self.availability = snapshot.val().availability;
		self.participantId = snapshot.key;
	}
	else{
		self.firstName = participantId;
		self.lastName = '';
		self.picture = '';
		self.phone = participantId;
		self.participantId = participantId;
	}
}