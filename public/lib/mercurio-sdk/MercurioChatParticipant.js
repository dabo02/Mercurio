/*
@constructor
@params: title - string containing title of message
@params: participants - array containing a collection of particpants
*/

function MercurioChatParticipant(userId, participantReadyCallback){
	
	var self = this;
	
	firebase.database().ref('account/' + userId).on('value', function(snapshot) {
	
		if(snapshot.exists()){
			if(!self.userId){
				AbstractAccount.apply(self, [snapshot.key, snapshot.val().firstName, 
					snapshot.val().lastName, snapshot.val().phone, snapshot.val().picture, 
					snapshot.val().status, snapshot.val().availability, snapshot.val().email, 
					snapshot.val().extension]);
				participantReadyCallback(self);
			}
			else{
				self.firstName = snapshot.val().firstName;
				self.lastName = snapshot.val().lastName;
				self.email = snapshot.val().email;
				self.status = snapshot.val().status;
				self.availability = snapshot.val().availability;
			}
		}
	});			
}

MercurioChatParticipant.prototype = Object.create(AbstractAccount.prototype);

MercurioChatParticipant.prototype.constructor = MercurioChatParticipant;