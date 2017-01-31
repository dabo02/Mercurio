/**
 * Created by brianlandron on 9/19/16.
 */
(function(){

    'use strict';

    angular.module('mercurio').controller('ProfileEditorController', ['$scope', 'accountService', '$mdDialog', '$rootScope', function($scope, accountService, $mdDialog, $rootScope) {

        var self = this;
        self.firstName = '',
        self.lastName = '',
        self.email = '',
        self.picture = '',
        self.statusMessage = '',
        self.availability = '';
        self.newAvailability = '';
        self.pictureChosen = true;
        self.accountService = accountService;
        self.activeAccount = accountService.activeAccount;

        self.showProfileEditorDialog = function(event) {

            $mdDialog.show({
                templateUrl: 'profileEditorForm',
                parent: angular.element(document.body),
                targetEvent: event,
                escapeToClose: true,
                clickOutsideToClose:true
                //fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            });
        }

        self.closeProfileEditorDialog = function(){
            $mdDialog.hide()
        };

        self.saveProfileInfo = function(){
            if(accountService.isAccountAvailable()) {
                if(self.newAvailability == ''){
                    self.newAvailability = accountService.activeAccount.availability;
                }

                accountService.activeAccount.saveProfileInfo(self.firstName, self.lastName, self.email,
                    self.statusMessage, parseInt(self.newAvailability));
                if(self.picture){
                    accountService.activeAccount.savePicture(self.picture, function(progress, uploadingImage){
                      accountService.uploadingImage = uploadingImage;
                      accountService.progress = progress;
                      accountService.opacity = progress/100+0.1;
                      $rootScope.$digest();
                      if(!uploadingImage){
                        //close dialog
                        self.closeProfileEditorDialog();
                      }
                    });
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
                switch(accountService.activeAccount.availability){

                    case 0:
                        self.availability = 'Online';
                        return 'Online';

                    case 1:
                        self.availability = 'Away';
                        return 'Away'

                    case 2:
                        self.availability = 'Busy';
                        return 'Busy';

                    case 3:
                        self.availability = 'onACall';
                        return 'onACall';

                    case 4:
                        self.availability = 'Offline';
                        return 'Offline';
                }
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

        self.getAvailability();

    }]);
})();
