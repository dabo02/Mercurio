/**
 * Created by brianlandron on 9/19/16.
 */
(function(){

    'use strict';

    angular.module('mercurio').controller('ProfileEditorController', ['$scope', 'accountService', function($scope, accountService) {

        var self = this;
        self.firstName = '',
        self.lastName = '',
        self.email = '',
        self.picture = '',
        self.statusMessage = '',
        self.availability = '';
        self.pictureChosen = true;

        self.activeAccount = accountService.activeAccount;

        self.saveProfileInfo = function(){
            if(accountService.isAccountAvailable()) {
                accountService.activeAccount.saveProfileInfo(self.firstName, self.lastName, self.email,
                    self.statusMessage, self.availability);
                if(self.picture){
                    accountService.activeAccount.savePicture(self.picture);
                }
            }
        }

        self.getStatusMessage = function(){
            if(accountService.isAccountAvailable()){
                return accountService.activeAccount.status;
            }
        }

        self.getAvailability = function(){
            if(accountService.isAccountAvailable()) {
                return accountService.activeAccount.availability;
            }
        }

        self.getFirstName = function(){
            if(accountService.isAccountAvailable()) {
                return accountService.activeAccount.firstName;
            }
        }

        self.getLastName = function(){
            if(accountService.isAccountAvailable()) {
                return accountService.activeAccount.lastName;
            }
        }

        self.getEmail = function(){
            if(accountService.isAccountAvailable()) {
                return accountService.activeAccount.email;
            }
        }

        self.getPhone = function(){
            if(accountService.isAccountAvailable()) {
                return accountService.activeAccount.phone;
            }
        }

        self.getExtension = function(){
            if(accountService.isAccountAvailable()) {
                return accountService.activeAccount.extension;
            }
        }

        self.getProfilePicture = function(){
            if(accountService.isAccountAvailable()) {
                return accountService.activeAccount.picture;
            }
        }

        self.profilePictureChosen = function(){
            console.log('picture chosen');
        }

        $scope.profilePictureSelected = function(element) {

            self.pictureChosen = true;

            $scope.$apply(function(scope) {

                self.picture = element.files[0];
                var reader = new FileReader();
                reader.onload = function(e) {
                    // handle onload
                    angular.element('#profilePicturePreview').attr('src', e.target.result);
                };
                reader.readAsDataURL(self.picture);
            });
        };
    }]);
})();
