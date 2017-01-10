/**
 * Created by brianlandron on 12/21/16.
 */

(function() {

    'use strict';

    angular.module('mercurio').controller('CallController', ['phoneService', 'accountService', '$stateParams', '$state', '$mdDialog', function (phoneService, accountService, $stateParams, $state, $mdDialog) {

        var self = this;

        //self.callIndex = $stateParams.callIndex;
        self.phoneService = phoneService;

        self.makeCall = function(){
            phoneService.phone.makeCall(phoneService.phone.currentCalls[0].to, 'localStream', 'remoteStream');
        }

        self.receiveCall = function(){
            phoneService.phone.answerCall('localStream', 'remoteStream');
        }

        self.muteCall = function(){
            phoneService.phone.muteCall();
        }

        self.endCall = function(){
            phoneService.stopRingbackTone();
            phoneService.phone.endCall();
        }

        self.showDTMFDialog = function(event) {
            $mdDialog.show({
                templateUrl: 'dtmfDialog',
                parent: angular.element(document.body),
                //targetEvent: event,
                escapeToClose: true,
                clickOutsideToClose:false
                //fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            });
        }

        self.dialDTMFTone = function(number){
            phoneService.phone.dialDTMFTone(number)
        }

        self.backToCallButtonClicked = function() {
            $state.go('call', {'callIndex' : 0});
        }
        //self.setupIncomingCall = function() {
        //    phoneService.phone.addNewCall(false, accountService.activeAccount.phone, phoneService.phone.callerId, true, new Date().getTime());
        //    $mdDialog.hide();
        //    $state.go('call', {'callIndex' : 0});
        //}
        //
        //self.ignoreCall = function(){
        //    phoneService.stopRingTone();
        //    phoneService.phone.endCall();
        //}

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
        else if($state.current == 'call'){
                location.replace("#/dialer");
        }


    }])
})();


