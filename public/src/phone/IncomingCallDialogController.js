/**
 * Created by brianlandron on 12/21/16.
 */

(function() {

    'use strict';

    angular.module('mercurio').controller('IncomingCallDialogController', ['phoneService', 'accountService', '$state', '$mdDialog', function (phoneService, accountService, $state, $mdDialog) {

        var self = this;

        self.receiveCall = function() {
            phoneService.phone.addNewCall(false, accountService.activeAccount.phone, accountService.activeAccount.phone, true, new Date().getTime());
            $mdDialog.hide();
            $state.go('call', {'callIndex' : 0});
        }

        self.ignoreCall = function(){
            phoneService.phone.endCall();
            phoneService.stopRingTone();
        }

    }])
})();

