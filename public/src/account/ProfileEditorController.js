/**
 * Created by brianlandron on 9/19/16.
 */
(function(){

    'use strict';

    angular.module('mercurio').controller('ProfileEditorController', ['$scope', 'accountService', '$mdDialog', '$rootScope', '$timeout', function($scope, accountService, $mdDialog, $rootScope, $timeout) {

        var self = this;
        self.pictureChosen = true;
        self.accountService = accountService;
        self.activeAccount = accountService.activeAccount;
        self.firstName = angular.copy(accountService.activeAccount.firstName);
        self.lastName = angular.copy(accountService.activeAccount.lastName);
        self.email = angular.copy(accountService.activeAccount.email);
        self.picture = '';//angular.copy(accountService.activeAccount.picture);
        self.statusMessage = angular.copy(accountService.activeAccount.status);
        self.availability = angular.copy(accountService.activeAccount.availability);
        self.newAvailability = '';
        self.statusInputLimit = '10';
        self.saved = null;
        self.msg = "";
        self.saveButtonIsAvailable = false;


        self.showProfileEditorDialog = function(event) {

            $mdDialog.show({
                templateUrl: 'profileEditorForm',
                parent: angular.element(document.body),
                targetEvent: event,
                escapeToClose: true,
                clickOutsideToClose: true
                //fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            });
        }

        self.closeProfileEditorDialog = function(){
            $mdDialog.hide()
        };

        self.profileChanged = function(){
            self.saveButtonIsAvailable = true;
        }

        self.saveProfileInfo = function(){
            if(accountService.isAccountAvailable()) {

                if(self.firstName != '' && self.lastName != ''){
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
                                self.msg = "Profile info and picture saved successfully";
                                self.saved = true;
                                $timeout(function(){
                                    $scope.$apply();
                                });
                                setTimeout(function(){
                                    self.saved = null;
                                    $timeout(function(){
                                        $scope.$apply();
                                    });
                                }, 3000);
                            }
                        });

                    }

                    else{
                        self.msg = "Profile info saved successfully";
                        self.saveButtonIsAvailable=false;
                        self.saved = true;
                        $timeout(function(){
                            $scope.$apply()});
                        setTimeout(function(){
                            self.saved = null;
                            $timeout(function(){
                                $scope.$apply()
                            });

                        }, 3000);
                    }
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
                        return 'On a Call';

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

        self.getCompanyName = function(){
            if(accountService.isAccountAvailable()) {
                return accountService.activeAccount.companyName;
            }
        }

        self.getProfilePicture = function(){
            if(accountService.isAccountAvailable()) {
              if(accountService.activeAccount.picture === ""){
                return 'images/default_contact_avatar.png';
              }
              else{
                return accountService.activeAccount.picture;
              }
            }
        }

        self.profilePictureChosen = function(){
        }

        $scope.profilePictureSelected = function(element) {

            self.pictureChosen = true;

            self.profileChanged();

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

        accountService.activeAccount.setProfileObserver(function(){
            self.firstName = angular.copy(accountService.activeAccount.firstName);
            self.lastName = angular.copy(accountService.activeAccount.lastName);
            self.email = angular.copy(accountService.activeAccount.email);
            self.statusMessage = angular.copy(accountService.activeAccount.status);
            self.availability = angular.copy(accountService.activeAccount.availability);
            $scope.$apply();
        })

    }]);
})();
