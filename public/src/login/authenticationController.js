(function() {

    'use strict';

    angular.module('users').controller('AuthenticationController', ['$scope', 'authenticationService', 'accountService', function($scope, authenticationService, accountService){

        var self = this;

        //if user is already logged in change state to dialer

        self.loginButtonClicked = function(email, password){

            authenticationService.login(email, password);
        }

        self.logoutButtonClicked = function(){

            authenticationService.logout();
        }

        self.recoverPasswordButtonClicked = function(){

            authenticationService.recoverPassword(accountService.activeAccount);
        }

        self.changePasswordButtonClicked = function(){

            authenticationService.changePassword();
        }
    }]);
}());