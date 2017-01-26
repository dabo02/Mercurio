/**
 * Created by brianlandron on 10/14/16.
 */


/**
 * Created by brianlandron on 9/20/16.
 */
(function(){

    'use strict';

    angular.module('mercurio').controller('CreateChatController', ['$rootScope', '$scope', 'chatClientService', '$mdDialog', 'accountService', function($rootScope, $scope, chatClientService, $mdDialog, accountService){

        var self = this;
        self.chatClient = chatClientService.chatClient;
        self.chatServiceClient = chatClientService;
        self.groupChatCheckbox = false;

        self.newContactChipSelected = function(contacts){
            console.log('new contact chip selected');
        }

        self.showCreateChatDialog = function(event) {
            $mdDialog.show({
                //controller: AddCallToCRMController,
                templateUrl: 'createChatForm',
                parent: angular.element(document.body),
                targetEvent: event,
                escapeToClose: true,
                clickOutsideToClose:true
                //fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            });
        }

        self.closeCreateChatDialog = function(){
            $mdDialog.hide()
        };

        self.createNewChat = function(contacts){

            if(contacts.length > 1 && !self.groupChatCheckbox){
                self.groupChatCheckbox = true;
                return;
            }
            else if(self.groupChatCheckbox && !self.title){
                return;
            }
            else if(contacts.length == 0){
                return;
            }
            else{
                chatClientService.chatClient.createChat(self.title, contacts, chatClientService.chatIsReadyToSendObserver);
                self.closeCreateChatDialog();
            }

        };

    }]);
})();