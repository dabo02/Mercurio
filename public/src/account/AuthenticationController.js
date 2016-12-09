(function() {

    'use strict';

    angular.module('users').controller('AuthenticationController', ['$scope', 'authenticationService', 'accountService', '$mdDialog', function($scope, authenticationService, accountService, $mdDialog){

        var self = this;

        self.resetPasswordEmailError = '';
        self.resetPasswordEmailSent = false;
        self.email = '';

        //if user is already logged in change state to dialer

        self.loginButtonClicked = function(email, password){

            authenticationService.login(email, password);
        }

        self.logoutButtonClicked = function(){

            authenticationService.logout();
        }

        self.changePasswordButtonClicked = function(){

            authenticationService.changePassword();
        }

        self.showResetPasswordDialog = function(event) {

            $mdDialog.show({
                templateUrl: 'resetPasswordForm',
                parent: angular.element(document.body),
                targetEvent: event,
                escapeToClose: true,
                clickOutsideToClose:true
                //fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            });
        }

        self.closeResetPasswordDialog = function(){
            $mdDialog.hide()
        };

        self.sendResetPasswordEmail = function(){
            self.resetPasswordEmailError = '';
            self.resetPasswordEmailSent = false;
            authenticationService.resetPassword(self.email, function(error){
                if(error){
                    self.resetPasswordEmailError = error.message;
                }

                self.resetPasswordEmailSent = true;
            });
        }
    }]);
}());