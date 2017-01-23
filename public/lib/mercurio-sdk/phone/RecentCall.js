/*
@constructor
*/

function RecentCall(callId, answered, duration, from, incoming, timeStamp, to){
	
	var self = this;
	self.callId = callId ||  null;
	self.answered = answered ||  null;
	self.duration = duration ||  null;
	self.from = from ||  null;
	self.incoming = incoming ||  null;
	self.timeStamp = timeStamp ||  null;
	self.to = to ||  null;
	
}