/**
 * Created by brianlandron on 10/5/16.
 */

(function(){

    'use strict';

    angular.module('mercurio').controller('ContactController', ['accountService','$stateParams', '$rootScope', '$mdDialog', function(accountService, $stateParams, $rootScope, $mdDialog){

        var self = this;
        self.selectedContact = accountService.selectedContact;
        self.contactList = accountService.activeAccount.contactManager.contactList;

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

        self.showContactProfileDialog = function(event) {

            $mdDialog.show({
                templateUrl: 'contactProfile',
                parent: angular.element(document.body),
                targetEvent: event,
                escapeToClose: true,
                clickOutsideToClose:true
                //fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            });
        }

        self.closeContactProfileDialog = function(){
            $mdDialog.hide()
        };

        self.viewContact = function(contact, event){
          if(contact){
            accountService.selectedContact = contact;
            self.showContactProfileDialog();
            }
          }


          self.viewContactById = function(id){
            if(id == accountService.activeAccount.userId){
              self.showProfileEditorDialog();
            }
            self.contactList.forEach(function (contact, index) {
                if (id == contact.userId) {
                   self.viewContact(contact);
                }

          });
        };

    }]);
})();
