/*
@constructor
*/

function Message(messageId, from, multimediaUrl, textContent, timeStamp){
	
	var self = this;
	self.messageId = messageId;
	self.from = from;
	self.multimediaUrl = multimediaUrl;
	self.textContent = textContent;
	self.timeStamp = timeStamp;
	self.hasMessage = {};
	self.read = {}
	
	firebase.database().ref('message-info/' + messageId).on("value", function(snapshot) {
	
		if(snapshot.exists()){
		
			self.hasMessage = snapshot.val()['has-message'];
			self.read = snapshot.val().read;
		}

	});
}