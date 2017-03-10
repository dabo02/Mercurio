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



function SMSChatParticipant(userId, participantReadyCallback){
	
	var self = this;
	
	firebase.database().ref('account/' + userId).on('value', function(snapshot) {
	
		if(snapshot.exists()){
			if(!self.userId){
				// var picture = null;
// 				if(snapshot.val().picture === "" || snapshot.val().picture == null){
// 					picture = "https://firebasestorage.googleapis.com/v0/b/mercurio-39a44.appspot.com/o/system%2Fic_profile_color_200dp.png?alt=media&token=38e55453-3aa6-48e3-b2eb-f33978fc4a7b";
// 				}
// 				else{
// 					picture = snapshot.val().picture;
// 				}
				
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

SMSChatParticipant.prototype = Object.create(AbstractAccount.prototype);

SMSChatParticipant.prototype.constructor = SMSChatParticipant;

SMSChatParticipant.prototype.getParticipantId = function(){
	return this.userId;
}