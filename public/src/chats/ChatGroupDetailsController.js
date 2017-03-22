/**
 * Created by brianlandron on 9/27/16.
 */

(function(){

    'use strict';

    angular.module('mercurio').controller('ChatGroupDetailsController', ['$scope', '$stateParams', 'chatClientService', 'accountService', '$mdDialog', '$rootScope', '$timeout', function($scope, $stateParams, chatClientService, accountService, $mdDialog, $rootScope, $timeout){

        var self = this;
        self.chatIndex = $stateParams.chatIndex;
        self.chatClientService = chatClientService;
        self.chatClient = chatClientService.chatClient;
        self.saveGroupDetailsButtonIsAvailable = false;
        self.canEdit = false;
        self.userIsAParticipant = false;
        self.userWasAdded = false;
        self.pictrue ='';
        self.allMetaData = null;
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
            if(self.checkIfChatClientOwnerIsMember()){
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

        $scope.groupPictureSelected = function(element) {

            self.pictureChosen = true;

            //self.profileChanged();

            $scope.$apply(function(scope) {

                self.picture = element.files[0];
                var reader = new FileReader();
                reader.onload = function(e) {
                    // handle onload
                    angular.element('#groupPicturePreview').attr('src', e.target.result);
                };
                reader.readAsDataURL(self.picture);
            });
        };

        self.editGroupName = function(){
              self.canEdit = true;
            };

        self.assignAdmin = function(participantId){
          chatClientService.selectedChat.assignAdmin(participantId);
        }

        self.removeParticipant = function(participantId){
          chatClientService.selectedChat.removeParticipantFromChatGroup(participantId);
        }

      self.checkIfChatClientOwnerIsAdmin = function(){
        var isAdmin = false;
        chatClientService.selectedChat.participantList.forEach(function(participant){
          if(participant.userId == chatClientService.chatClient.chatClientOwner && participant.isAdmin) {
              isAdmin = true;
            }
        })
        return isAdmin;
      }


        self.exitChatGroup = function(){
          var adminCounter = 0;
          var chatClientOwnerIsAdmin = false;
          chatClientService.selectedChat.participantList.forEach(function(participant){
            if(participant.isAdmin){
              adminCounter++;
              if(participant.userId == chatClientService.chatClient.chatClientOwner){
                chatClientOwnerIsAdmin = true;
              }
            }
          });
          if(adminCounter == 1 && chatClientOwnerIsAdmin){
            var confirm = $mdDialog.confirm()
                .title('You can not exit the group because you are the only admin, assign a admin and try again.')
                .ariaLabel('delete confirm')
                .targetEvent(event)
                .ok('Close');

            $mdDialog.show(confirm).then(function() {
            }, function() {});
          }
          else{
            var confirm = $mdDialog.confirm()
                .title('Are you sure you want to exit the group?')
                .ariaLabel('delete confirm')
                .targetEvent(event)
                .ok('Exit')
                .cancel('Cancel');

            $mdDialog.show(confirm).then(function() {
              chatClientService.selectedChat.removeParticipantFromChatGroup(chatClientService.chatClient.chatClientOwner);
            }, function() {

            });

          }
        }

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
          }, 500);

          setTimeout(function(){
              self.userIsAParticipant = false;
              self.userWasAdded = false;
              $rootScope.$apply();
        }, 3000);
        }

        self.chatGroupDetailsChanged = function(){
            self.saveGroupDetailsButtonIsAvailable = true;
        }

        $scope.groupPictureSelected = function(element) {

            self.pictureChosen = true;
            self.chatGroupDetailsChanged();
            $scope.$apply(function(scope) {
              self.picture = element.files[0];
              EXIF.getData(self.picture, function() {
                self.allMetaData = EXIF.getAllTags(this);
              });
                var reader = new FileReader();
                reader.onload = function(e) {
                    // handle onload
                    angular.element('#groupPicturePreview').attr('src', e.target.result);
                    if(self.allMetaData.Orientation == 6 && self.allMetaData){
                      angular.element('#groupPicturePreview').css({
                              'transform': 'rotate(90deg)'
                        });
                    }
                    else{
                      angular.element('#groupPicturePreview').css({
                        'transform': ''
                      });
                    }
                };
                reader.readAsDataURL(self.picture);
            });
        };

        self.getDateCreated = function(){
          var date = new Date(chatClientService.selectedChat.timeStamp);
          return date.toDateString();
        }

        self.changeConfirmed = function(){
          self.canEdit = false;
        }

        self.cancelChange = function(){
          self.newChatTitle = chatClientService.selectedChat.title;
          self.canEdit = false;
        }

        self.muteSettingChanged = function(){
            self.saveGroupDetailsButtonIsAvailable = true;
        }

        self.checkIfChatClientOwnerIsMember = function(){
          if(chatClientService.selectedChat){
            self.isChatClientOwnerGroupMember = false;
          chatClientService.selectedChat.participantList.forEach(function(participant){
            if(participant.userId == chatClientService.chatClient.chatClientOwner) {
                  self.isChatClientOwnerGroupMember = true;
              }
          })
        }
          return self.isChatClientOwnerGroupMember;
        }

        self.saveGroupDetails = function(){
            if(self.newChatTitle != chatClientService.selectedChat.title && self.newChatTitle){
                chatClientService.selectedChat.saveChatTitle(self.newChatTitle);
            }
            if(self.picture){
                chatClientService.chatClient.saveGroupPicture(self.picture, chatClientService.selectedChat, function(progress, uploadingImage){
                    chatClientService.uploadingImage = uploadingImage;
                    chatClientService.progress = progress;
                    chatClientService.opacity = progress/100+0.1;
                    $rootScope.$digest();
                    if(!uploadingImage){
                        //self.msg = "Profile info and picture saved successfully";
                        //self.saved = true;
                        //console.log("Entro");
                        $timeout(function(){
                            $rootScope.$apply();
                        });
                        setTimeout(function(){
                            //self.saved = null;
                            $timeout(function(){
                                $rootScope.$apply();
                            });
                        }, 3000);
                    }
                });

            }

            self.closeChatGroupDetailsDialog();
        }
        //

        chatClientService.chatClient.setChatObserver(function () {
          setTimeout(function(){
          $scope.$apply();
          }, 100);

         });

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
