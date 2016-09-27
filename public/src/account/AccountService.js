/**
 * Created by brianlandron on 9/14/16.
 */
(function(){

    'use strict';

    angular.module('mercurio').service('accountService', ['authenticationService', 'chatClientService', '$state', '$location', function(authenticationService, chatClientService, $state, $location){

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

        authenticationService.setAccountObserver(function(account){
            self.activeAccount = account;
            chatClientService.instantiateChatClient(account.userId);
            if(!self.isAccountAvailable()){
                $location.url('/login');
            }
            else{
                $state.go('dialer');
            }
        });

    }]);

})();