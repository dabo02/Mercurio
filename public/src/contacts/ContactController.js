/**
 * Created by brianlandron on 10/5/16.
 */

(function(){

    'use strict';

    angular.module('mercurio').controller('ContactController', ['$stateParams', 'accountService', '$rootScope', function($stateParams, accountService, $rootScope){

        var self = this;
        // self.contact = accountService.activeAccount.contactManager.contactList[$stateParams.contactIndex];
        var listener = setInterval(function(){
          if(accountService.activeAccount.contactManager.contactList.length > 0){
            self.contact = accountService.activeAccount.contactManager.contactList[$stateParams.contactIndex];
            $rootScope.contact = accountService.activeAccount.contactManager.contactList[$stateParams.contactIndex];
            clearInterval(listener);
          }
        },10);
        // $rootScope.contact = accountService.activeAccount.contactManager.contactList[$stateParams.contactIndex];
    }]);
})();
