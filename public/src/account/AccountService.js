/**
 * Created by brianlandron on 9/14/16.
 */
(function(){

    'use strict';

    angular.module('mercurio').service('accountService', ['authenticationService', 'chatClientService', 'phoneService', 'crmService', '$state', '$location', '$rootScope', function(authenticationService, chatClientService, phoneService, crmService, $state, $location, $rootScope){

        var self = this;

        self.activeAccount =  null;
        self.selectedContact = null;

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

                if($state.current.name == 'login' || $state.current.name == 'register'){
                    $state.go('dialer');
                }

            }
            //Change variable...
            $rootScope.isAccountReady = true;
            $rootScope.spinnerActivated = false;
            $rootScope.$apply();

            // setInterval(function(){
            //   $rootScope.$apply();
            //   console.log("interval")
            // }, 2000)

        });

        $rootScope.$watch('activeAccount', function (currentUser) {

            //$rootScope.spinnerActivated = false;
            //if (angular.isDefined(currentUser)) {
            //    if (currentUser) {
            //        $rootScope.currentUser = currentUser;
            //    } else {
            //        //deferred.reject(true);
            //        //$state.go('login');
            //    }
            //}
        });

    }]);

})();
