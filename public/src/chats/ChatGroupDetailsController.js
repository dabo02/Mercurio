/**
 * Created by brianlandron on 9/27/16.
 */

(function(){

    'use strict';

    angular.module('mercurio').controller('ChatGroupDetailsController', ['$scope', '$stateParams', 'chatClientService', 'accountService', '$mdDialog', '$rootScope', function($scope, $stateParams, chatClientService, accountService, $mdDialog, $rootScope){

        var self = this;
        self.chatIndex = $stateParams.chatIndex;
        self.chatClientService = chatClientService;
        self.chatClient = chatClientService.chatClient;
        self.saveGroupDetailsButtonIsAvailable = false;
        // self.newChatTitle = chatClientService.chatClient.chatList[$stateParams.chatIndex].title;
        // self.newMuteSetting = chatClientService.chatClient.chatList[$stateParams.chatIndex].settings.mute;

        self.isChatClientOwnerGroupMember = false;
        var chatSettingsFetched = false;
        var listener = setInterval(function(){
          if(chatClientService.chatClient.chatList.length > 0 && !chatSettingsFetched){
            self.newMuteSetting = chatClientService.chatClient.chatList[$stateParams.chatIndex].settings.mute;
            self.newChatTitle = chatClientService.chatClient.chatList[$stateParams.chatIndex].title;
            $rootScope.newMuteSetting = self.newMuteSetting;
            $rootScope.newChatTitle = self.newChatTitle;
            chatSettingsFetched = true;
            clearInterval(listener);
          }
          console.log("interval")
        },10);

        self.showChatGroupDetailsDialog = function(event) {

            if(self.isChatClientOwnerGroupMember){
                $mdDialog.show({
                    templateUrl: 'chatGroupDetails',
                    parent: angular.element(document.body),
                    targetEvent: event,
                    escapeToClose: true,
                    clickOutsideToClose:true
                    //fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
                });
            }
        }

        self.closeChatGroupDetailsDialog = function(){
            $mdDialog.hide()
        };

        self.exitGroup = function(){
          var listener = setInterval(function(){
            if(chatClientService.chatClient.chatList.length > 0){
              chatClientService.chatClient.chatList[$stateParams.chatIndex]
                  .exitChatGroup(chatClientService.chatClient.chatClientOwner);
              self.closeChatGroupDetailsDialog();
              clearInterval(listener);
            }
            console.log("interval")
          },10);
            // chatClientService.chatClient.chatList[$stateParams.chatIndex]
            //     .exitChatGroup(chatClientService.chatClient.chatClientOwner);
            // self.closeChatGroupDetailsDialog();
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
        //
        var listener = setInterval(function(){
          if(chatClientService.chatClient.chatList.length > 0){
            chatClientService.chatClient.chatList[$stateParams.chatIndex].participantList.forEach(function(participant){
                if(participant.userId == chatClientService.chatClient.chatClientOwner){
                    self.isChatClientOwnerGroupMember = true;
                }
            });
            clearInterval(listener);
          }
          console.log("interval")
        },10);
        //
        // chatClientService.chatClient.chatList[$stateParams.chatIndex].participantList.forEach(function(participant){
        //     if(participant.userId == chatClientService.chatClient.chatClientOwner){
        //         self.isChatClientOwnerGroupMember = true;
        //     }
        // });
    }]);
})();
