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
        self.canEdit = false;
        self.userIsAParticipant = false;
        self.userWasAdded = false;
        // self.newChatTitle = chatClientService.chatClient.chatList[$stateParams.chatIndex].title;
        // self.newMuteSetting = chatClientService.chatClient.chatList[$stateParams.chatIndex].settings.mute;

        self.isChatClientOwnerGroupMember = true;
        // var listener = setInterval(function(){
        //   if(chatClientService.chatClient.chatList.length > 0){
        //     self.newMuteSetting = chatClientService.chatClient.chatList[$stateParams.chatIndex].settings.mute;
        //     self.newChatTitle = chatClientService.chatClient.chatList[$stateParams.chatIndex].title;
        //     clearInterval(listener);
        //   }
        // },10);

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

        self.editGroupName = function(){
              self.canEdit = true;
            };

        self.closeChatGroupDetailsDialog = function(){
            $mdDialog.hide()
        };

        self.toggleMute = function(){
          if(chatClientService.selectedChat.settings.mute){
            chatClientService.selectedChat.toggleNotifications(chatClientService.chatClient.chatClientOwner, false);
          }
          else{
            chatClientService.selectedChat.toggleNotifications(chatClientService.chatClient.chatClientOwner, true);
          }

        }

        self.exitGroup = function(){
          var listener = setInterval(function(){
            if(chatClientService.chatClient.chatList.length > 0){
              chatClientService.selectedChat
                  .exitChatGroup(chatClientService.chatClient.chatClientOwner);
              self.closeChatGroupDetailsDialog();
              clearInterval(listener);
            }
          },10);
            // chatClientService.chatClient.chatList[$stateParams.chatIndex]
            //     .exitChatGroup(chatClientService.chatClient.chatClientOwner);
            // self.closeChatGroupDetailsDialog();
        };

        self.addParticipantsToGroup = function(contacts){
            // if selected contacts array contains at least one contacts
            if(contacts.length > 0){
                chatClientService.selectedChat.participantList.forEach(function(participant){
                    if(contacts[0].userId == participant.userId){
                        self.userIsAParticipant = true;
                    }
                })
                if(!self.userIsAParticipant){
                self.userWasAdded = true;
                chatClientService.selectedChat.addParticipants(contacts);
              }
            }
            setTimeout(function(){
            $rootScope.$apply();
          }, 100);

          setTimeout(function(){
              self.userIsAParticipant = false;
              self.userWasAdded = false;
              $rootScope.$apply();
        }, 3000);
        }

        self.chatTitleChanged = function(){
            self.saveGroupDetailsButtonIsAvailable = true;
        }

        $scope.groupPictureSelected = function(element) {

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

        self.getDateCreated = function(){
          var date = new Date(chatClientService.selectedChat.timeStamp);
          return date.toDateString();
        }

        self.muteSettingChanged = function(){
            self.saveGroupDetailsButtonIsAvailable = true;
        }

        self.saveGroupDetails = function(){
            if(self.newChatTitle != chatClientService.selectedChat.title){
                chatClientService.selectedChat.saveChatTitle(self.newChatTitle);
            }

            // if(self.newMuteSetting != chatClientService.chatClient.chatList[$stateParams.chatIndex].settings.mute){
            //     chatClientService.chatClient.chatList[$stateParams.chatIndex]
            //         .toggleNotifications(chatClientService.chatClient.chatClientOwner, self.newMuteSetting);
            //         console.log(self.newMuteSetting);
            // }

            self.closeChatGroupDetailsDialog();
        }
        //
        var listener = setInterval(function(){
          if(chatClientService.selectedChat){
            chatClientService.selectedChat.participantList.forEach(function(participant){
                if(participant.userId == chatClientService.chatClient.chatClientOwner){
                    self.isChatClientOwnerGroupMember = true;
                }
            });
            clearInterval(listener);
          }
        },10);
        //
        // chatClientService.chatClient.chatList[$stateParams.chatIndex].participantList.forEach(function(participant){
        //     if(participant.userId == chatClientService.chatClient.chatClientOwner){
        //         self.isChatClientOwnerGroupMember = true;
        //     }
        // });
    }]);
})();
