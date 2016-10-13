/*
@constructor
*/

function RecentCall(callId, answered, duration, from, incoming, timeStamp, to){
	
	var self = this;
	self.callId = callId;
	self.answered = answered;
	self.duration = duration;
	self.from = from;
	self.incoming = incoming;
	self.timeStamp = timeStamp;
	self.to = to;
	
}