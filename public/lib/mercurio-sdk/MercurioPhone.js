
/**
 * Created by root on 09-20-16.
 */
function MercurioPhone(configuration, userId) {


	this.ua = new JsSIP.UA(configuration);
	this.sessionInfo = [];
	this.thisView = null;
	this.remoteView = null;
	this.localStream = null;
	this.stream = null;
	this.call = null;

	var self = this;
	self.recentCallList = [];
	self.phoneOwner = userId;
	
	var pageNumber = 1;
	var limit = 50;
	
	self.fetchRecentCallListPage(pageNumber, limit);
};

MercurioPhone.prototype.fetchRecentCallListPage = function(pageNumber, limit){

	var self = this;
	
	//empty out chatList to make room for it's updated copy
	self.recentCallList = [];
	
	// fetch list of 50 most recent chats
	// TODO missing pagination and filters
	
	firebase.database().ref('user-calls/' + self.phoneOwner).orderByChild('timeStamp').limitToFirst(1 * pageNumber * limit).on("child_added", function(snapshot) {
	
		if(snapshot.exists()){
		
			var chat;
			// send observer callback registered in addChat to MercurioChat constructor
			//if(snapshot.val().lastMessage){
				//chat = new MercurioChat(snapshot.key, snapshot.val().participantCount);
			//}
			call = new RecentCall(snapshot.key, snapshot.val().answered, snapshot.val().duration,
					snapshot.val().from, snapshot.val().incoming, snapshot.val().timeStamp, snapshot.val().to);
			
			self.recentCallList.unshift(call);
		}

	});
	
// 	firebase.database().ref('user-calls/' + self.chatClientOwner).orderByChild('lastMessage/timeStamp').limitToFirst(pageNumber * limit).on('child_removed', function(snapshot) {
// 	
// 		//compare chat ids from local chat list to snapshot keys in order to find local 
// 		//reference to chat; remove chat from local contacts list
// 
// 		self.chatList.forEach(function(chat, index){
// 			if(chat.chatId === snapshot.key){
// 				self.chatList.splice(index, 1);
// 			}
// 		});
// 	});
}
MercurioPhone.prototype.registerUA = function(){

  this.ua.start();
  this.ua.register();
  this.thisView = document.getElementById('my-video');
  this.remoteView = document.getElementById('peer-video');

  };

MercurioPhone.prototype.unregisterUA = function(){

  this.ua.unregister();

};

MercurioPhone.prototype.uaEvents = function(){
  var self = this;
  this.ua.on('connected', function (data) {

    console.log('succesfully connected to:' + data.socket.url);

  });
  this.ua.on('registered', function(data) {

    console.log('Succesfully Registered to:' + data.response.to.uri.host);

  });
  this.ua.on('registrationFailed', function(data) {

    console.log('Registration failed with: ' + data.cause);

  });
  this.ua.on('newRTCSession', function(data) {

    if (data.originator === 'remote') {
      console.log('newRTCSession inbound');

      var info = {
        session: data.session,
        isOnHold: false,
        isActive: false
      };
      self.sessionInfo.push(info);
      var index  = self.sessionInfo.length -1;
      setTimeout(self.acceptCall(self.sessionInfo, index), 3000);
    } else {

      console.log('new RTC Session outbound');

    }
  });
};

MercurioPhone.prototype.makeCall = function(callee, options) {

  this.session = this.ua.call(callee, options);

};

MercurioPhone.prototype.onCallProgress = function(body) {

  console.log('Call on Progress');

};

MercurioPhone.prototype.onCallConfirmed = function(body) {

  this.localStream = this.session.connection.getLocalStreams()[0];
  this.thisView = JsSIP.rtcninja.attachMediaStream(this.thisView, this.localStream);
  console.log('Call Confirmed');
};

MercurioPhone.prototype.onCallFailed = function(body){

  console.log("Call Failed because call was: " + body.cause);

};

MercurioPhone.prototype.onCallEnded = function(body) {
  var self = this;
  self.sessionInfo.forEach(function (call, index){
    if (call.session === null) {
      self.sessionInfo.splice(index, 1);
    };
  });

};

MercurioPhone.prototype.onStreamAdded = function(body) {

  this.stream = body.stream;
  this.remoteView = JsSIP.rtcninja.attachMediaStream(this.remoteView, this.stream);

};

MercurioPhone.prototype.onCallStarted= function(body) {

  console.log('Call started');
  var rtcSession = body.sender;

};

MercurioPhone.prototype.endCall = function(options, sessionInfo, index) {

  sessionInfo[index].session.terminate(options);
  sessionInfo.splice(index, 1);

};

MercurioPhone.prototype.acceptCall = function(sessionInfo, index) {

  sessionInfo[index].session.answer();
  sessionInfo[index].isOnHold = false;
  sessionInfo[index].isActive = true;

};

MercurioPhone.prototype.holdCall = function(sessionInfo, index) {

  if (sessionInfo[index].session.isReadyToReOffer()) {

    sessionInfo[index].session.hold();
    sessionInfo[index].isOnHold = true;
    sessionInfo[index].isActive = false;

  };

};

MercurioPhone.prototype.unHoldCall = function() {

  if (this.session.isReadyToReOffer()) {

    this.session.unhold();

  };

};

MercurioPhone.prototype.referCall = function(sessionInfo, index, target) {


  sessionInfo[index].session.refer(target);
  sessionInfo.splice(index, 1);

};

MercurioPhone.prototype.swapCalls = function(target) {



};