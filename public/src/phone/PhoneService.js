/**
 * Created by brianlandron on 10/6/16.
 */
(function(){

    'use strict';

    angular.module('mercurio').service('phoneService', ['$location', '$mdDialog', function($location, $mdDialog){

        var self = this;
        self.phone;
        self.activeAccount;
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
                self.callAcceptedObserver, self.callInProgressObserver, self.localStreamObserver, self.remoteStreamObserver);
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
            console.log('incoming call');
        }

        self.callHangupObserver = function(){
            console.log('call hung up');
            location.replace("#/dialer");
            self.phone.currentCalls = [];
        }

        self.callAcceptedObserver = function(){
            console.log('call accepted');
            self.stopRingTone();
            self.stopRingbackTone();
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
    }]);

})();