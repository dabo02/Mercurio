/**
 * Created by brianlandron on 9/14/16.
 */
(function(){

    'use strict';

    angular.module('mercurio').service('accountService', ['authenticationService', 'chatClientService', 'phoneService', 'crmService', '$state', '$location', function(authenticationService, chatClientService, phoneService, crmService, $state, $location){

        var self = this;

        self.activeAccount =  null;

        self.isAccountAvailable = function(){

            if(self.activeAccount !== null){
                return true;
            }
            else{
                return false;
            }
        }

        self.isContactListAvailable = function(){

            if(self.activeAccount.contactManager.contactList.length > 0){
                return true;
            }
            else{
                return false;
            }
        }

        self.resetPassword = function(email, emailSentObserver){
            self.activeAccount.resetPassword(email, emailSentObserver);
        }

        authenticationService.setAccountObserver(function(account){
            self.activeAccount = account;

            if(!self.isAccountAvailable()){
                $location.url('/login');
            }
            else{
                self.activeAccount.contactManager = new MercurioContactManager(account.userId);
                chatClientService.instantiateChatClient(account.userId);
                phoneService.instantiatePhone(account);
                crmService.instantiateCRMManager(account.userId);
                $state.go('dialer'); // go to previous state instead
            }
            //else{
            //    $state.go('dialer');
            //}
        });

    }]);

})();
