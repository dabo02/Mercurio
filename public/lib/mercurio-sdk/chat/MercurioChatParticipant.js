/*
@constructor
@params: title - string containing title of message
@params: participants - array containing a collection of particpants
*/


function MercurioChatParticipant(chatClientOwner, userId, participantReadyCallback){
	
	var self = this;

	self.firstName = 'Unknown';
	self.lastName = '';
	self.email = '';
	self.picture = '';
	self.phone = '';
	self.availability = '';
	self.participantId = userId;

	if(chatClientOwner == userId){
		firebase.database().ref('account/' + userId).on('value', function(snapshot) {

			if(snapshot.exists()){
				self.initializeParticipant(snapshot);
			}

			participantReadyCallback(self);
		});
	}
	else{
		//firebase.database().ref('user-contacts/' + chatClientOwner).orderByChild('userId').equalTo(userId).on('value', function(snapshot) {
		firebase.database().ref('account/' + userId).on('value', function(snapshot) {

			if(snapshot.exists()){
				//snapshot.forEach(function(childSnapshot) {
					self.initializeParticipant(snapshot);
				//})
			}

			participantReadyCallback(self);
		});
	}
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