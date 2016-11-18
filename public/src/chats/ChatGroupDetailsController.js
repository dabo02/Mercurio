/**
 * Created by brianlandron on 9/27/16.
 */

(function(){

    'use strict';

    angular.module('mercurio').controller('ChatGroupDetailsController', ['$scope', '$stateParams', 'chatClientService', 'accountService', '$mdDialog', function($scope, $stateParams, chatClientService, accountService, $mdDialog){

        var self = this;
        self.chatIndex = $stateParams.chatIndex;
        self.chatClient = chatClientService.chatClient;
        self.saveGroupDetailsButtonIsAvailable = false;
        self.newChatTitle = chatClientService.chatClient.chatList[$stateParams.chatIndex].title;
        self.newMuteSetting = chatClientService.chatClient.chatList[$stateParams.chatIndex].settings.mute;

        self.showChatGroupDetailsDialog = function(event) {
            $mdDialog.show({
                templateUrl: 'chatGroupDetails',
                parent: angular.element(document.body),
                targetEvent: event,
                escapeToClose: true,
                clickOutsideToClose:true
                //fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            });
        }

        self.closeChatGroupDetailsDialog = function(){
            $mdDialog.hide()
        };

        self.exitGroup = function(){
            console.log('exiting group');
        };

        self.addParticipantsToGroup = function(contacts){

            // if selected contacts array contains at least one contacts
            if(contacts.length > 0){
                chatClientService.chatClient.chatList[$stateParams.chatIndex].addParticipants(contacts);
            }
        }

        self.chatTitleChanged = function(){
            self.saveGroupDetailsButtonIsAvailable = true;
        }

        self.muteSettingChanged = function(){
            self.saveGroupDetailsButtonIsAvailable = true;
        }

        self.saveGroupDetails = function(){
            if(self.newChatTitle != chatClientService.chatClient.chatList[$stateParams.chatIndex].title){
                chatClientService.chatClient.chatList[$stateParams.chatIndex].saveChatTitle(self.newChatTitle);
            }

            if(self.newMuteSetting != chatClientService.chatClient.chatList[$stateParams.chatIndex].settings.mute){
                chatClientService.chatClient.chatList[$stateParams.chatIndex]
                    .toggleNotifications(chatClientService.chatClient.chatClientOwner, self.newMuteSetting);
            }

            self.closeChatGroupDetailsDialog();
        }
    }]);
})();