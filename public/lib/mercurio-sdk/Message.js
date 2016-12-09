/*
@constructor
*/

function Message(messageId, from, multimediaUrl, textContent, timeStamp, read){
	
	var self = this;
	self.messageId = messageId;
	self.from = from;
	self.multimediaUrl = multimediaUrl;
	self.textContent = textContent;
	self.timeStamp = timeStamp;
	//self.hasMessage = {};
	//self.read = {}
	self.read = read;
}