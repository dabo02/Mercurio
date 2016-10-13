/**
 * Created by brianlandron on 10/5/16.
 */

(function(){

    'use strict';

    angular.module('mercurio').controller('ContactController', ['$stateParams', 'accountService', function($stateParams, accountService){

        var self = this;
        self.contact = accountService.activeAccount.contactManager.contactList[$stateParams.contactIndex];

    }]);
})();