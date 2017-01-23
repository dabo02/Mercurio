/**
 * Created by root on 10-19-16.
 */

/**
 * @summary This class manages the basic flow of a call it works as a soft phone and integrates to the Optivon Inc. javascript SDK.
 * @class JanusPhone: Main Object used to initialize al instance fields of the JanusPhone object.
 * @param userId: primary key of account related to janus phone.
 * @param myStream: id of html <video> tag to attach to local janus media stream.
 * @param peerStream: id of html <video> tag to attach to remote janus media stream.
 * @param phoneInitializationObserver: callback function to call when janus plugin initializes.
 * @listens plugin initialization
 * @property self: instance field containing javscript's 'this' keyword.
 * @property debug: variable to debugging management (possible values are: true, false, or an array containing each tool refer to Janus official docs)
 * @property audioConferenceHandler: instance field for the audio conference plugin to be attached.
 * @property videoConferenceHandler: instance field for the video conference plugin to be attached.
 * @property sipCallHandler: instance field for the sip plugin to be attached.
 * @property jsepOnIncomingCall: instance field that stores the SDP for an incoming call.
 * @property jsepOnAcceptedCall: instance field that stores the SDP when a call has been accepted.
 * @property jsepOnMakeCall: instance field that stores the the SDP of an outbound call.
 * @property localStream: instance field that stores the reference to the attached local media stream.
 * @property remoteStream: instance field that stores the reference to the attached remote media stream.
 * @property cT: instance field that stores the function for the call timer to wait 1 second.
 * @property callTimer: instance field that stores the actual elapsed time for the call.
 * @property localView: instance field that stores the reference to the local html <video tag> for attaching media.
 * @property remoteView: instance field that stores the reference to the remote html <video tag> for attaching media.
 * @property callOnMute: boolean indicating if the state of the audio of the call is muted or not (not muted by default).
 * @property remoteHasVideo: boolean indicating if the peer connection accepts video conferencing (false by default).
 * @property localHasVideo: boolean indicating if the local connection accepts video conferencing (false by default).
 * @property recentCallList: array instance field that stores the reference to the list of calls recently made by the UA.
 * @property phoneOwner: array instance field that stores the reference to the user id related to this phone account.
 * @property doVideo: boolean indicating if the user wishes to share video or not (false by default).
 **/

function JanusPhone(userId, phoneInitializationObserver) {

	var self = this;
	self.debug = false;
	self.audioConferenceHandler = null;
	self.videoPluginHandler = null;
	self.sipCallHandler = null;
	self.videoConferencePlugin = null;
	self.jsepOnIncomingCall = null;
	self.jsepOnAcceptedCall = null;
	self.jsepOnMakeCall = null;
	self.localStream = null;
	self.remoteStream = null;
	self.cT = null;
	self.callTimer = null;
	self.callerId = null;
	self.localView;
	self.remoteView;
	self.callOnMute = false;
	self.outboundCall = false;
	self.endCallRequest = false;
	self.ignoreCallFlag = false;
	self.remoteHasVideo = false;
	self.localHasVideo = false;
	self.recentCallList = [];
	self.phoneOwner = userId;
	self.doVideo = false;
	self.currentCalls = [];
	var pageNumber = 1;
	var limit = 50;

	self.fetchRecentCallListPage(pageNumber, limit); //TODO write respective inline comment.
	self.initialize(phoneInitializationObserver); // Initialize Janus plugin
};

/**
 * @function JanusPhone.fetchRecentCallListPage:
 * @param pageNumber: TODO fill this
 * @param limit: TODO also fill this
 */


JanusPhone.prototype.addNewCall = function(answered, to, from, incoming, timeStamp){

	var self = this;
	var newCallRef = firebase.database().ref().child('user-calls/' + self.phoneOwner).push();
	var callInfo = {
		answered: answered,
		duration: '0:00:00',
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

JanusPhone.prototype.updateFinishedCall = function(){

	var self = this;

	var updates = {};

	updates['/user-calls/' + self.phoneOwner + "/" + self.currentCalls[0].callId + '/answered'] = self.currentCalls[0].answered;
	updates['/user-calls/' + self.phoneOwner + "/" + self.currentCalls[0].callId + '/duration'] = self.currentCalls[0].duration;

	firebase.database().ref().update(updates);

	// TODO - add error management callback
}

/**
 * @function JanusPhone.fetchRecentCallListPage:
 * @param pageNumber: TODO fill this
 * @param limit: TODO also fill this
 */
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

/**
 * @function JanusPhone.deleteCalls:
 * @param indices:
 */
//TODO write respective inline comments for this function
JanusPhone.prototype.deleteCalls = function(indices){
	var self = this;
	indices.forEach(function(index){
		firebase.database().ref('user-calls/' + self.phoneOwner + '/' + self.recentCallList[index].callId).set(null);
	});
}

/**
 * @function JanusPhone.registerUA: registers the current user on its company's registrar server.
 * @param account: account registered to the current user.
 * @param userIsRegisteredObserver: callback function to be set for when the user is registered on the registrar.
 * @listens registered event
 * @param incomingCallObserver: callback function to be set for when the user has an incoming call.
 * @listens incoming event
 * @param callHangupObserver: callback function to be set for when a hangup event has been received.
 * @listens hangup event
 * @param callAcceptedObserver: callback function to be set for when a call was accepted.
 * @listens accepted event
 * @param callInProgressObserver: callback function to be set for when the user has an outbound call.
 * @listens calling event
 * @param localStreamObserver: callback function to be set for when the local stream is available for attachment.
 * @listens onlocalstream callback function from Janus.
 * @param remoteStreamObserver: callback function to be set for when a remote stream is available for attachment.
 * @listens onremotestream callback function from Janus.
 **/

JanusPhone.prototype.registerUA = function(account, userIsRegisteredObserver, incomingCallObserver, callHangupObserver, callAcceptedObserver, callInProgressObserver, localStreamObserver, remoteStreamObserver, webRTCStateObserver) {
	var self = this;

	// Call back assignment
	self.incomingCallObserver = incomingCallObserver;
	self.callHangUpObserver = callHangupObserver;
	self.callAcceptedObserver = callAcceptedObserver;
	self.localStreamObserver = localStreamObserver;
	self.remoteStreamObserver = remoteStreamObserver;
	self.callInProgressObserver = callInProgressObserver;
	self.webRTCStateObserver = webRTCStateObserver;

	// Registration Info for respective telephony switch
	var registrationInfo = {
		"request": "register",
		"username": "sip:" + account.sipUsername + "@63.131.240.90",
		"secret": account.sipPassword,
		"display_name": account.firstName + " " + account.lastName,
		"proxy": 'sip:63.131.240.90:5060'
	};
	self.userIsRegisteredObserver = userIsRegisteredObserver;
	// sends registrationInfo to janus gateway for registration purposes
	self.sipCallHandler.send({"message": registrationInfo});

}

/**
 * @function JanusPhone.initialize: initializes the sip plugin and enables communication to the Janus gateway.
 * @param phoneInitializationObserver: callback function to be called when the plugin success callback has been triggered.
 **/

JanusPhone.prototype.initialize = function(phoneInitializationObserver) {
	var self = this;

	Janus.init({
		debug: self.debug,
		callback: function() {

			self.janus = new Janus({
				server: 'ws://ec2-54-165-3-139.compute-1.amazonaws.com:8080',
				success: function() {
					Janus.debug("Succesfully Connected to server: " + this.server);
					self.janus.attach({

						plugin: "janus.plugin.sip",
						success: function (pluginHandle) {
							self.sipCallHandler = pluginHandle;
							Janus.debug("Plugin attached! (" + self.sipCallHandler.getPlugin() + ", id=" + self.sipCallHandler.getId() + "))");
							phoneInitializationObserver(); // Lets UI know that  the plugin has Initialized succesfully and is ready for use
						},
						error: function (error) {
							Janus.error(" -- Error attaching plugin, cause: " + error);
						},
						consentDialog: function (on) {
							Janus.debug("Consent dialog should be " + (on ? "on" : "off") + " now");
							if (on) {
								var nav = navigator.mozGetUserMedia || navigator.webkitGetUserMedia; // gets user media from respective browser
								$.blockUI({ // Blocks screen while user sets preferences for audio and video
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
								// Restores screen after user manages permissions with media
								$.unblockUI();
							}
						},
						webrtcState: function (state) {
							if (state === true) {
								self.inCallTimer();
								if (self.outboundCall = true) {
									self.currentCalls[0].answered = true;
									self.outboundCall =false;
								} else {
									self.currentCalls[0].answered = true; // TODO Ask default value to take proper action
								}
								self.webRTCStateObserver(state);
							}
							//else {
							//	if(self.endCallRequest == false) {
							//		self.stopTimer = true;
							//		self.currentCalls[0].duration = self.callTimer;
							//		self.updateFinishedCall();
							//		self.webRTCStateObserver(state);
							//	}
							//}

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
								Janus.debug("Event is "+event);
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
									var indexOfNumber = result.username.search(":");
									var indexOfDomain = result.username.search("@");
									self.callerId = result.username.slice(indexOfNumber+1, indexOfDomain);
									if(self.srtp === "sdes_optional")
										self.rtpType = " (SDES-SRTP offered)";
									else if(self.srtp === "sdes_mandatory")
										self.rtpType = " (SDES-SRTP mandatory)";
									self.jsepOnIncomingCall = jsep;
									self.stopTimer = false;
									self.incomingCallObserver();
								}
								if (event === 'calling') {
									self.jsepOnMakeCall = jsep;
									self.stopTimer =false;
									self.callInProgress = true;
									self.callInProgressObserver();
								}
								if (event === 'accepted') {

									if (jsep !== null && jsep !== undefined) {
										self.jsepOnAcceptedCall = jsep;
										self.callAcceptedObserver();
									} else {
										self.jsepOnAcceptedCall = null;
										self.callAcceptedObserver();
									}
								}
								if (event === 'hangup') {
									Janus.debug("call hanged");
									if (self.endCallRequest === true) {
										if (self.outboundCall == true || self.ignoreCallFlag == true) {
											self.outboundCall = false;
											self.ignoreCallFlag = false;
											self.currentCalls[0].answered = false;
										} else {
											self.currentCalls[0].duration = self.callTimer;
										}
										self.sipCallHandler.hangup(); // cleans up UI and removes streams
									} else {
										if (self.currentCalls[0].answered === true) {
											self.currentCalls[0].duration = self.callTimer;
										} else {
											self.currentCalls[0].answered = false;
										}
										self.sipCallHandler.hangup(); // cleans up UI and removes streams

									}
									self.updateFinishedCall();
									clearInterval(self.cT);
									self.stopTimer = true;
									self.endCallRequest = false;
									self.callHangUpObserver();
								}
							}
						},
						onlocalstream: function (stream) {
							Janus.debug(" ::: Got a local stream :::");
							self.localStream = stream;

							// if ($('#myvideo').length === 0)
							// $('#videoleft').append('<video class="rounded centered" id="myvideo" width=320 height=240 autoplay muted="muted"/>');

							Janus.attachMediaStream(self.localView, self.localStream);
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
							Janus.attachMediaStream(self.remoteView, self.remoteStream);
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

/**
 * @function JanusPhone.makeCall: function that initiates an outbound call.
 * @param phoneNumber: callee's phone number.
 **/
JanusPhone.prototype.makeCall = function(phoneNumber, myStreamTag, peerStreamTag) {
	var self = this;
	self.localView = document.getElementById(myStreamTag);
	self.remoteView = document.getElementById(peerStreamTag);
	self.sipCallHandler.createOffer({
		jsep: self.jsepOnMakeCall,
		media: {
			audioSend: true,
			audioRecv: true,		// We DO want audio
			videoSend: self.doVideo,
			videoRecv: self.doVideo	// We MAY want video (False by default)
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
			var body = {request: "call", uri: "sip:" + phoneNumber + "@63.131.240.90"};
			// Note: you can also ask the plugin to negotiate SDES-SRTP, instead of the
			// default plain RTP, by adding a "srtp" attribute to the request. Valid
			// values are "sdes_optional" and "sdes_mandatory", e.g.:
			//		var body = { request: "call", uri: $('#peer').val(), srtp: "sdes_optional" };
			// "sdes_optional" will negotiate RTP/AVP and add a crypto line,
			// "sdes_mandatory" will set the protocol to RTP/SAVP instead.
			// Just beware that some endpoints will NOT accept an INVITE
			// with a crypto line in it if the protocol is not RTP/SAVP,
			// so if you want SDES use "sdes_optional" with care.
			self.sipCallHandler.send({"message": body, "jsep": jsep});
		},
		error: function(error) {
			Janus.error("WebRTC error...", error);

		}
	});
};
/**
 * @function JanusPhone.endCall: function that ends the current call
 **/
JanusPhone.prototype.endCall = function() {
	var self = this;
	var hangup = {"request": "hangup"};
	self.endCallRequest = true;
	self.sipCallHandler.send({"message": hangup}); // sends habgup request to gateway
	self.sipCallHandler.hangup(); // cleans up UI and removes streams
};

JanusPhone.prototype.answerCall = function(myStreamTag, peerStreamTag) {
	var self = this;
	self.localView = document.getElementById(myStreamTag);
	self.remoteView = document.getElementById(peerStreamTag);

	self.sipCallHandler.createAnswer(
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

				self.sipCallHandler.send({"message": body, "jsep": jsep});
			},
			error: function(error) {
				Janus.error("WebRTC error:", error);
				// Don't keep the caller waiting any longer, but use a 480 instead of the default 486 to clarify the cause
				var body = { "request": "decline", "code": 480 };
				self.sipCallHandler.send({"message": body});
			}
		});
};

/**
 * @function JanusPhone.dialDTMFTone: function to send DTMF tones in call.
 * @param tone: integer or string with the tone to send.
 **/

JanusPhone.prototype.dialDTMFTone = function(tone) {

	var self = this;
	// self.sipCallHandler.dtmf({ dtmf: { tones: tone }}); // this only works in chrome browser
	self.sipCallHandler.send({"message": {"request": "dtmf_info", "digit": tone}}); // sends DTMF tones over sip_info sip message
};

/**
 * @function JanusPhone.inCallTimer: function that starts the count for the in call timer.
 */
JanusPhone.prototype.inCallTimer = function() {
	var self = this;
	var seconds = 0; // stores number of seconds of ongoing call
	var minutes = 0; // stores number of minutes of ongoing call
	var hours = 0; // stores number of hours of ongoing call
	self.cT = setInterval(function() {


		seconds++;

		if (seconds >= 60) {
			seconds = 0;
			minutes ++;

			if (minutes >= 60) {
				minutes = 0;
				hours++;
			}

		}
		// The next two 'if' statements add a '0' to the current value of minutes and seconds
		// in order to support the hh:mm:ss format instead of h:m:s
		if (seconds < 10 && seconds.length !== 2) {
			seconds = "0" + seconds.toString();
		}

		if (minutes < 10 && minutes.length !== 2) {
			minutes = "0" + minutes.toString()
		}
		// Assignment of actual timer for the call
		self.callTimer = hours.toString() + ":" + minutes.toString() +  ":" + seconds.toString() ;
		Janus.debug(" " + self.callTimer + " ");
		$('.callTimer').html(self.callTimer);

	}, 1000);


};

/**
 * @function JanusPhone.createAnswerOnAccepted: function to call when an accepted event has been triggered.
 **/

JanusPhone.prototype.createAnswerOnAccepted = function() {
	var self = this;
	if (self.currentCalls[0].incoming = true) {
		if (self.jsepOnAcceptedCall.type === 'Answer') {
			if (self.jsepOnIncomingCall !== null) {
				self.sipCallHandler.handleRemoteJsep({jsep: self.jsepOnIncomingCall, error: self.endCall()});
				self.jsepOnIncomingCall = null;
			}
		}
	}
	self.sipCallHandler.createAnswer({
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

			self.sipCallHandler.send({"message": body, "jsep": jsep});
		},
		error: function(error) {
			Janus.error("WebRTC error:", error);
			// Don't keep the caller waiting any longer, but use a 480 instead of the default 486 to clarify the cause
			var body = { "request": "decline", "code": 480 };
			self.sipCallHandler.send({"message": body});
		}
	});
};

/**
 * @function JanusPhone.muteCall: function that mutes the current call.
 **/
JanusPhone.prototype.muteCall = function() {
	var self = this;
	if (self.callOnMute !== true) {
		self.sipCallHandler.muteAudio();
		self.callOnMute = true;
	} else {
		self.sipCallHandler.unmuteAudio();
		self.callOnMute = false;
	}
};