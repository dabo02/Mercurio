/**
 * Created by brianlandron on 12/21/16.
 */

(function() {

    'use strict';

    angular.module('mercurio').controller('CallController', ['phoneService', 'accountService', '$stateParams', function (phoneService, accountService, $stateParams) {

        var self = this;

        self.callIndex = $stateParams.callIndex;
        self.phoneService = phoneService;

        self.makeCall = function(){
            phoneService.phone.makeCall(phoneService.phone.currentCalls[0].to, 'localStream', 'remoteStream');
        }

        self.receiveCall = function(){
            phoneService.phone.answerCall('localStream', 'remoteStream');
        }

        self.endCall = function(){
            phoneService.phone.endCall();
            phoneService.stopRingbackTone();
        }

        if(phoneService.phone.currentCalls.length > 0){
            if(!phoneService.phone.currentCalls[0].answered){
                if(phoneService.phone.currentCalls[0].incoming){
                    phoneService.phone.currentCalls[0].answered = true;
                    self.receiveCall();
                }
                else{
                    self.makeCall();
                }
            }

        }
        else{
            //location.replace("#/dialer");
        }

    }])
})();


