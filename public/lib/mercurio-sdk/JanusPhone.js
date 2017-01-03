/**
 * Created by root on 10-19-16.
 */
function JanusPhone(userId, phoneInitializationObserver) {

    var self = this;
    self.audioPlugin = null;
    self.audioConferencePlugin = null;
    self.videoPlugin = null;
    self.sipCall = null;
    self.videoConferencePlugin = null;
    self.jsepOnIncomingCall = null;
    self.jsepOnAcceptedCall = null;
    self.jsepOnMakeCall = null;
    self.localStream = null;
    self.remoteStream = null;
	self.cT = null;
	self.callTimer = null;
    self.localView;// = document.getElementById(myStream);
    self.remoteView;// = document.getElementById(peerStream);
	self.callOnMute = false;
	self.remoteHasVideo = true;
    self.localHasVideo = false;
    self.recentCallList = [];
	self.phoneOwner = userId;
	self.doVideo = false;
	self.currentCalls = [];
	var pageNumber = 1;
	var limit = 50;
	
	self.fetchRecentCallListPage(pageNumber, limit);
	self.initialize(phoneInitializationObserver);
};

JanusPhone.prototype.addNewCall = function(answered, to, from, incoming, timeStamp){

	var self = this;
	var newCallRef = firebase.database().ref().child('user-calls/' + self.phoneOwner).push();

	var callInfo = {
		answered: answered,
		duration: '',
		from: from,
		incoming: incoming,
		timeStamp: timeStamp,
		to: to
	};
	
	var updates = {};
	// add user-chat entry for participant
	updates['/user-calls/' + self.phoneOwner + "/" + newCallRef.key] = callInfo;
	firebase.database().ref().update(updates);
	
	this.currentCalls.push(new RecentCall(newCallRef.key, answered, '', from, incoming, timeStamp, to));
}

JanusPhone.prototype.fetchRecentCallListPage = function(pageNumber, limit){

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
	
	firebase.database().ref('user-calls/' + self.phoneOwner).orderByChild('timeStamp').limitToFirst(pageNumber * limit).on('child_removed', function(snapshot) {
	
		//compare chat ids from local chat list to snapshot keys in order to find local 
		//reference to chat; remove chat from local contacts list

		self.recentCallList.forEach(function(call, index){
			if(call.callId === snapshot.key){
				self.recentCallList.splice(index, 1);
			}
		});
	});
}

JanusPhone.prototype.deleteCalls = function(indices){
	var self = this;
	indices.forEach(function(index){
		firebase.database().ref('user-calls/' + self.phoneOwner + '/' + self.recentCallList[index].callId).set(null);
	});	
}

JanusPhone.prototype.registerUA = function(account, userIsRegisteredObserver, incomingCallObserver, callHangupObserver, callAcceptedObserver, callInProgressObserver, localStreamObserver, remoteStreamObserver) {
    var self = this;
    self.incomingCallObserver = incomingCallObserver;
    self.callHangUpObserver = callHangupObserver;
    self.callAcceptedObserver = callAcceptedObserver;
	self.localStreamObserver = localStreamObserver;
	self.remoteStreamObserver = remoteStreamObserver;
	self.callInProgressObserver = callInProgressObserver;
    var registrationInfo = {
        "request": "register",
        "username": "sip:" + account.sipUsername + "@63.131.240.90",
        "secret": account.sipPassword,
        "display_name": account.firstName + " " + account.lastName,
        "proxy": 'sip:63.131.240.90:5060'
    };
    self.userIsRegisteredObserver = userIsRegisteredObserver;
    self.sipCall.send({"message": registrationInfo});

}
JanusPhone.prototype.initialize = function(phoneInitializationObserver) {
	var self = this;

	Janus.init({
		debug: "all",
		callback: function() {

			self.janus = new Janus({
				server: 'ws://ec2-54-165-3-139.compute-1.amazonaws.com:8080',
				success: function() {
					Janus.debug("Succesfully Connected to server: " + this.server);
					self.janus.attach({

						plugin: "janus.plugin.sip",
						success: function (pluginHandle) {
							self.sipCall = pluginHandle;
							Janus.debug("Plugin attached! (" + self.sipCall.getPlugin() + ", id=" + self.sipCall.getId() + "))");
							phoneInitializationObserver();
						},
						error: function (error) {
							Janus.error(" -- Error attaching plugin, cause: " + error);
						},
						consentDialog: function (on) {
							Janus.debug("Consent dialog should be " + (on ? "on" : "off") + " now");
							if (on) {
								var nav = navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
								$.blockUI({
									message: '<div><img src="/javascripts/bower_components/janus-gateway/html/up_arrow.png"/></div>',
									css: {
										border: 'none',
										padding: '15px',
										backgroundColor: 'transparent',
										color: '#aaa',
										top: '10px',
										left: (nav? '-100px' : '300px')
									} });
							} else {
								// Restore screen
								$.unblockUI();
							}
						},
						onmessage: function (msg, jsep) {
							Janus.debug(" ::: Got a message :::");
							Janus.debug(JSON.stringify(msg));
							Janus.debug(JSON.stringify(jsep));
							if (jsep) {
								if (jsep.sdp !== null || jsep.sdp !== undefined) {
									var index = jsep.sdp.search("a=rtpmap");
									var topHalf = jsep.sdp.slice(0, index - 1);
									var bottomHalf = jsep.sdp.slice(index);
									topHalf = topHalf + "\na=rtpmap:101 telephone-event/8000\n";
									jsep.sdp = topHalf + "" + bottomHalf;
									Janus.debug(JSON.stringify(jsep));

								}
							}
							var result = msg["result"];

							if (result !== null && result !== undefined && result["event"] !== undefined && result["event"] !== null) {
								var event = result["event"];
								console.log("Event is "+event);
								if (event === 'registration_failed') {
									Janus.warn("Registration failed: " + result.code + " " + result.reason);
									return;
								}
								if (event === 'registered') {
									Janus.debug("Succesfully registered as " + result.username + "! in " + JSON.stringify(result));
									self.userIsRegisteredObserver();
								}
								if (event === 'incomingcall') {
									self.rtpType = "";
		                            self.srtp = result["srtp"];
		                            if(self.srtp === "sdes_optional")
		                                self.rtpType = " (SDES-SRTP offered)";
		                            else if(self.srtp === "sdes_mandatory")
		                                self.rtpType = " (SDES-SRTP mandatory)";
									console.log(self.rtpType);
		                            self.jsepOnIncomingCall = jsep;
									self.stopTimer = false;
		                            self.incomingCallObserver();
		                          }
								if (event === 'calling') {
									self.jsepOnMakeCall = jsep;
									self.stopTimer =false;
									self.callInProgressObserver();
								}
								if (event === 'accepted') {

									if (jsep !== null && jsep !== undefined) {
										self.jsepOnAcceptedCall = jsep;
										self.callAcceptedObserver();
									} else {
										self.callAcceptedObserver();
									}
								}
								if (event === 'hangup') {
									Janus.debug("call hanged");
									clearInterval(self.cT);
									self.callHangUpObserver();
								}
							}
						},
						onlocalstream: function (stream) {
							Janus.debug(" ::: Got a local stream :::");
							self.localStream = stream;

														// if ($('#myvideo').length === 0)
								// $('#videoleft').append('<video class="rounded centered" id="myvideo" width=320 height=240 autoplay muted="muted"/>');

							Janus.attachMediaStream(self.localView, stream);
							self.localView.muted = "muted";
							var videoTracks = stream.getVideoTracks();
							if (videoTracks === null || videoTracks === undefined || videoTracks.length === 0) {
								// No webcam
								self.localHasVideo = false;
							}
							self.localStreamObserver();
						},
						onremotestream: function (stream) {
							Janus.debug(" ::: Got a remote stream :::");
							self.remoteStream = stream;
							Janus.attachMediaStream(self.remoteView, stream);
							var videoTracks = stream.getVideoTracks();
							if(videoTracks === null || videoTracks === undefined || videoTracks.length === 0 || videoTracks[0].muted) {
									// No remote video
									self.remoteHasVideo = false;
								}
							self.remoteStreamObserver();


						}
					});
				},
				error: function(cause) {
					Janus.debug("Could not connect to: " + this.server +" because " + cause);
				},
				destroyed: function() {
					Janus.debug("Connection to "+ this.server + " destroyed");
				}
			});
		}
	});
};
JanusPhone.prototype.makeCall = function(phoneNumber, myStreamTag, peerStreamTag) {
    var self = this;
	self.localView = document.getElementById(myStreamTag);
	self.remoteView = document.getElementById(peerStreamTag);
    self.sipCall.createOffer({
            jsep: self.jsepOnMakeCall,
            media: {
                audioSend: true,
                audioRecv: true,		// We DO want audio
                videoSend: false,
                videoRecv: false	// We MAY want video
            },
            success: function(jsep) {
                Janus.debug("Got SDP!");
                Janus.debug(jsep);
	            var index = jsep.sdp.search("a=rtpmap");
	            var topHalf = jsep.sdp.slice(0, index-1);
	            var bottomHalf = jsep.sdp.slice(index);
	            topHalf = topHalf + "\na=rtpmap:101 telephone-event/8000\n";
	            jsep.sdp = topHalf + "" + bottomHalf;

                // By default, you only pass the SIP URI to call as an
                // argument to a "call" request. Should you want the
                // SIP stack to add some custom headers to the INVITE,
                // you can do so by adding an additional "headers" object,
                // containing each of the headers as key-value, e.g.:
                //		var body = { request: "call", uri: $('#peer').val(),
                //			headers: {
                //				"My-Header": "value",
                //				"AnotherHeader": "another string"
                //			}
                //		};
                var body = {request: "call", uri: "sip:"+phoneNumber+"@63.131.240.90"};
                // Note: you can also ask the plugin to negotiate SDES-SRTP, instead of the
                // default plain RTP, by adding a "srtp" attribute to the request. Valid
                // values are "sdes_optional" and "sdes_mandatory", e.g.:
                //		var body = { request: "call", uri: $('#peer').val(), srtp: "sdes_optional" };
                // "sdes_optional" will negotiate RTP/AVP and add a crypto line,
                // "sdes_mandatory" will set the protocol to RTP/SAVP instead.
                // Just beware that some endpoints will NOT accept an INVITE
                // with a crypto line in it if the protocol is not RTP/SAVP,
                // so if you want SDES use "sdes_optional" with care.
                self.sipCall.send({"message": body, "jsep": jsep});
            },
            error: function(error) {
                Janus.error("WebRTC error...", error);

            }
        });
};

JanusPhone.prototype.endCall = function() {
    var self = this;
    var hangup = {"request": "hangup"};
    self.sipCall.send({"message": hangup});
    self.sipCall.hangup();
};

JanusPhone.prototype.answerCall = function(myStreamTag, peerStreamTag) {
	var self = this;
	self.localView = document.getElementById(myStreamTag);
	self.remoteView = document.getElementById(peerStreamTag);

    self.sipCall.createAnswer(
        {
            jsep: self.jsepOnIncomingCall,
            media: { audio: true, video: self.doVideo },
            success: function(jsep) {
                var body = { request: "accept" };
	            var index = jsep.sdp.search("a=rtpmap");
	            var topHalf = jsep.sdp.slice(0, index-1);
	            var bottomHalf = jsep.sdp.slice(index);
	            topHalf = topHalf + "\na=rtpmap:101 telephone-event/8000\n";
	            jsep.sdp = topHalf + "" + bottomHalf;
                // Note: as with "call", you can add a "srtp" attribute to
                // negotiate/mandate SDES support for this incoming call.
                // The default behaviour is to automatically use it if
                // the caller negotiated it, but you may choose to require
                // SDES support by setting "srtp" to "sdes_mandatory", e.g.:
                //		var body = { request: "accept", srtp: "sdes_mandatory" };
                // This way you'll tell the plugin to accept the call, but ONLY
                // if SDES is available, and you don't want plain RTP. If it
                // is not available, you'll get an error (452) back.

                self.sipCall.send({"message": body, "jsep": jsep});
            },
            error: function(error) {
                Janus.error("WebRTC error:", error);
                // Don't keep the caller waiting any longer, but use a 480 instead of the default 486 to clarify the cause
                var body = { "request": "decline", "code": 480 };
                self.sipCall.send({"message": body});
            }
        });
};

JanusPhone.prototype.dialDTMFTone = function(tone) {

	var self = this;
	// self.sipCall.dtmf({ dtmf: { tones: tone }});
	self.sipCall.send({"message": {"request": "dtmf_info", "digit": tone}});
};

JanusPhone.prototype.inCallTimer = function() {
	var self = this;
	self.seconds = 0;
	self.minutes = 0;
	self.hours = 0;
	self.cT = setInterval(function() {

		self.seconds++;

		if (self.seconds >= 60) {
			self.seconds = 0;
			self.minutes ++;

			if (self.minutes >= 60) {
				self.minutes = 0;
				self.hours++;
			}

		}

		self.callTimer = self.hours.toString() + ":" + self.minutes.toString() +  ":" + self.seconds.toString() ;
		Janus.debug(" " + self.callTimer + " ");

	}, 1000);


};

JanusPhone.prototype.createAnswerOnAccepted = function() {
	var self = this;
	self.inCallTimer();
	self.sipCall.createAnswer({
		jsep: self.jsepOnAcceptedCall,
		media: {audio: true,
			video: self.doVideo},
		success: function(jsep) {
			var body = { request: "accept" };
			var index = jsep.sdp.search("a=rtpmap");
			var topHalf = jsep.sdp.slice(0, index-1);
			var bottomHalf = jsep.sdp.slice(index);
			topHalf = topHalf + "\na=rtpmap:101 telephone-event/8000\n";
			jsep.sdp = topHalf + "" + bottomHalf;
			self.jsepOnAcceptedCall = null;
			// Note: as with "call", you can add a "srtp" attribute to
			// negotiate/mandate SDES support for this incoming call.
			// The default behaviour is to automatically use it if
			// the caller negotiated it, but you may choose to require
			// SDES support by setting "srtp" to "sdes_mandatory", e.g.:
			//		var body = { request: "accept", srtp: "sdes_mandatory" };
			// This way you'll tell the plugin to accept the call, but ONLY
			// if SDES is available, and you don't want plain RTP. If it
			// is not available, you'll get an error (452) back.

			self.sipCall.send({"message": body, "jsep": jsep});
			if (self.jsepOnIncomingCall!== null) {
				self.sipCall.handleRemoteJsep({jsep: self.jsepOnIncomingCall, error: self.endCall()});
				self.jsepOnIncomingCall = null;
			}
		},
		error: function(error) {
			Janus.error("WebRTC error:", error);
			// Don't keep the caller waiting any longer, but use a 480 instead of the default 486 to clarify the cause
			var body = { "request": "decline", "code": 480 };
			self.sipCall.send({"message": body});
		}
	});
};

JanusPhone.prototype.muteCall = function() {
	var self = this;
	if (self.callOnMute !== true) {
		self.sipCall.muteAudio();
		self.callOnMute = true;
	}
};

JanusPhone.prototype.unmuteCall = function() {
	var self = this;
	if (self.callOnMute === true) {
		self.sipCall.unmuteAudio();
		self.callOnMute = false;
	}
};

