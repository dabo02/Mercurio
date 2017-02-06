/**
 * Created by brianlandron on 12/21/16.
 */

(function() {

    'use strict';

    angular.module('mercurio').controller('IncomingCallDialogController', ['phoneService', 'accountService', '$state', '$mdDialog', function (phoneService, accountService, $state, $mdDialog) {

        var self = this;
        self.phoneService = phoneService;

        self.receiveCall = function() {
            phoneService.stopRingTone();
            $mdDialog.hide();
            $state.go('call', {'callIndex' : 0});
        }

        self.ignoreCall = function(){
            phoneService.phone.ignoreCallFlag = true;
            phoneService.stopRingTone();
            $mdDialog.hide();
            $state.reload();
            phoneService.phone.answerCall();
            phoneService.phone.endCall();
        }

        phoneService.phone.addNewCall(false, accountService.activeAccount.phone, phoneService.phone.callerId, true, new Date().getTime());

    }])
})(); 


