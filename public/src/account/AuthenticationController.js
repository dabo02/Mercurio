(function() {

    'use strict';

    angular.module('users').controller('AuthenticationController', ['$scope', 'authenticationService', 'accountService', 'chatClientService', 'phoneService', 'crmService', '$mdDialog', '$rootScope', '$timeout', function($scope, authenticationService, accountService, chatClientService, phoneService, crmService, $mdDialog, $rootScope, $timeout){

        var self = this;

        self.resetPasswordEmailError = '';
        self.resetPasswordEmailSent = false;
        self.email = '';
        self.authenticationService = authenticationService;
        self.resetPasswordButtonIsAvailable = false;
        //if user is already logged in change state to dialer

        self.loginButtonClicked = function(email, password){
            // $rootScope.spinnerActivated = true;
            //$rootScope.$apply();
            authenticationService.login(email, password, function(error){
              authenticationService.feedback = error;
              $rootScope.$apply();
              setTimeout(function(){
                authenticationService.feedback = '';
                $rootScope.$apply();
              },3000);
            });

        }

        self.emailChanged = function(){
          self.resetPasswordButtonIsAvailable = true;
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
        };

        self.showRegisterAccountDialog = function(event) {

            $mdDialog.show({
                templateUrl: 'registerAccountForm',
                parent: angular.element(document.body),
                targetEvent: event,
                escapeToClose: true,
                clickOutsideToClose:true
                //fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            });
        };

        self.logoutButtonClicked = function(){

            authenticationService.logout();
            chatClientService.chatClient = null;
            phoneService.phone = null;
            crmService.crmManager = null;
        }

        self.changePasswordButtonClicked = function(){

            authenticationService.changePassword();
        }



        self.closeResetPasswordDialog = function(){
            $mdDialog.hide()
        };

        self.closeRegisterAccountDialog = function(){
            $mdDialog.hide()
        };

        self.sendResetPasswordEmail = function(){
            self.resetPasswordEmailError = '';
            self.resetPasswordEmailSent = false;
            authenticationService.resetPassword(self.email, function(error){
                if(error){
                    self.resetPasswordEmailError = error.message;
                    self.resetPasswordButtonIsAvailable = false;
                }

                self.resetPasswordEmailSent = true;
                $timeout(function(){
                    $scope.$apply();
                    setTimeout(function(){
                           self.resetPasswordEmailSent = false;
                           $timeout(function(){
                               $scope.$apply();
                           });
                    }, 4000);
                });
            });
        }

        self.registerAccount = function(){
          authenticationService.register(self.registerData);
        }
    }]);
}());
