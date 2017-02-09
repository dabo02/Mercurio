/**
 * Created by brianlandron on 10/6/16.
 */
(function(){

    'use strict';

    angular.module('mercurio').service('phoneService', ['crmService', '$location', '$mdDialog', '$state', '$timeout', '$rootScope', function(crmService, $location, $mdDialog, $state, $timeout, $rootScope){

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

        }

        self.incomingCallObserver = function(){

            crmService.fetchCallableRecords(self.phone.callerId, self.activeAccount.phone);

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
            self.stopRingTone();
            self.stopRingbackTone();
            $mdDialog.hide();
            self.contactSearchString = '';

            if(crmService.crmManager.crmList != undefined && crmService.crmManager.crmList != null && crmService.crmManager.crmList.length > 0){
                crmService.showAddCallToCRMDialog();//, self.selectedCallDirection, event, crmService.crmManager.crmList[0].insertCallsAutomatically);
            }

            self.phone.currentCalls = [];

            window.onbeforeunload = null;

            if($state.current.name != "call")
            {
                $state.reload();
                $timeout(function(){

                    $rootScope.$apply();
                })
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
            self.phone.createAnswerOnAccepted();
        }

        self.callInProgressObserver = function(){

            crmService.fetchCallableRecords(crmService.getPhoneNumberToLog(self.phone.currentCalls[0], self.activeAccount.phone));

            self.ringbackTone.addEventListener('ended', function() {
                this.currentTime = 0;
                this.play();
            }, false);

            self.ringbackTone.play();

            window.onbeforeunload = function() {
                return "";
            }
        }

        self.localStreamObserver = function(){
        }

        self.remoteStreamObserver = function(){
        }

        self.stopRingTone = function(){
            self.ringTone.pause();
            self.ringTone.currentTime = 0;
        }

        self.stopRingbackTone = function(){
            self.ringbackTone.pause();
            self.ringbackTone.currentTime = 0;
        }
    }]);

})();
