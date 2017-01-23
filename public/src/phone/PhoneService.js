/**
 * Created by brianlandron on 10/6/16.
 */
(function(){

    'use strict';

    angular.module('mercurio').service('phoneService', ['crmService', '$location', '$mdDialog', '$state', function(crmService, $location, $mdDialog, $state){

        var self = this;
        self.phone;
        self.crmService = crmService;
        self.activeAccount;
        self.contactSearchString = '';
        self.ringbackTone = new Audio('audio/ringback.mp3');
        self.ringTone = new Audio('audio/bar.mp3');

        self.instantiatePhone = function(activeAccount){
            self.phone = new JanusPhone(activeAccount.userId, self.phoneInitializationObserver);
            self.activeAccount = activeAccount;

            //self.phone = new MercurioPhone({
            //    ws_servers: 'ws://mercurio-gateway-813906161.us-west-1.elb.amazonaws.com:8080',
            //    uri: '7873042981@63.131.240.90',
            //    password: 'jENnJzYMHBqGE9o'
            //}, userId);
        }

        self.phoneInitializationObserver = function(){
            self.phone.registerUA(self.activeAccount, self.userIsRegisteredObserver, self.incomingCallObserver, self.callHangupObserver,
                self.callAcceptedObserver, self.callInProgressObserver, self.localStreamObserver, self.remoteStreamObserver, self.webRTCStateObserver);
        }

        self.userIsRegisteredObserver = function(){
            console.log('user is registered');
        }

        self.incomingCallObserver = function(){

            self.ringTone.addEventListener('ended', function() {
                this.currentTime = 0;
                this.play();
            }, false);

            self.ringTone.play();

            $mdDialog.show({
                templateUrl: 'incomingCallDialog',
                parent: angular.element(document.body),
                //targetEvent: event,
                escapeToClose: false,
                clickOutsideToClose:false
                //fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            });
        }

        self.callHangupObserver = function(){
            console.log('call hung up');
            self.stopRingTone();
            self.stopRingbackTone();
            $mdDialog.hide();
            self.contactSearchString = '';
            self.phone.endCall();
            self.addCallToCRMCallFinished(self.phone.currentCalls[0]);
            self.phone.currentCalls = [];
            if($state.current.name != "call")
            {
                $state.reload();
            }else {
                $state.go('dialer');
            };



        }

        self.webRTCStateObserver = function(webRTCState){
            if (webRTCState === true){
                self.stopRingTone();
                self.stopRingbackTone();
             } else {
                self.phone.endCall();
                self.phone.currentCalls = [];
                $state.reload();
            }
        }
        self.callAcceptedObserver = function(){
            console.log('call accepted');
            self.phone.createAnswerOnAccepted();
        }

        self.callInProgressObserver = function(){

            self.ringbackTone.addEventListener('ended', function() {
                this.currentTime = 0;
                this.play();
            }, false);

            self.ringbackTone.play();
            console.log('call in progress');
        }

        self.localStreamObserver = function(){
            console.log('local stream added')
        }

        self.remoteStreamObserver = function(){
            console.log('remote stream added');
        }

        self.stopRingTone = function(){
            self.ringTone.pause();
            self.ringTone.currentTime = 0;
        }

        self.stopRingbackTone = function(){
            self.ringbackTone.pause();
            self.ringbackTone.currentTime = 0;
        }

        self.addCallToCRMCallFinished = function(call, event){
            if(call.from === self.activeAccount.phone){
              self.selectedNumber = call.to;
              self.selectedCallDirection = 'Outgoing';
            }
            else{
              self.selectedNumber = call.from;
              self.selectedCallDirection = 'Incoming';
            }

            if(crmService.crmManager.crmList != undefined && crmService.crmManager.crmList != null && crmService.crmManager.crmList.length > 0)
          crmService.addCallToCRM(self.selectedNumber, self.selectedCallDirection, event, crmService.crmManager.crmList[0].insertCallsAutomatically);
        }



    }]);

})();
