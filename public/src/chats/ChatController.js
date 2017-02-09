/**
 * Created by brianlandron on 9/20/16.
 */
(function(){

    'use strict';

    angular.module('mercurio').controller('ChatController', ['$rootScope', '$scope', '$stateParams', 'chatClientService', 'accountService', '$location', '$anchorScroll', '$state', '$mdDialog', '$timeout', function($rootScope, $scope, $stateParams, chatClientService, accountService, $location, $anchorScroll, $state, $mdDialog, $timeout){

        var self = this;
        self.chatIndex = $stateParams.chatIndex;
        self.chatClientService = chatClientService;

        var listener = setInterval(function(){
          if(chatClientService.selectedChat){
            self.newMuteSetting = chatClientService.selectedChat.settings.mute;
            clearInterval(listener);
          }
        },10);

        // var listener = setInterval(function(){
        //   if($rootScope.chatList.length > 0){
        //     self.contact = accountService.activeAccount.contactManager.contactList[$stateParams.contactIndex];
        //     $rootScope.contact = accountService.activeAccount.contactManager.contactList[$stateParams.contactIndex];
        //     clearInterval(listener);
        //   }
        //   console.log("interval")
        // },10);
        // var counter=0;
        // var imgListener = null;
        // imgListener = setInterval(function(){
        //   if($scope.imglink.length > 0){
        //     $scope.$apply();
        //     clearInterval(imgListener);
        //   }
        //   console.log("interval")
        // },10);

        /*self.chat = chatClientService.chatClient.chatList[self.chatIndex];
        self.messageList = self.chat.messageList;
        self.participantList = self.chat.participantList;
        self.chatClientOwner = $stateParams.chatClientOwner*/;
        self.textContentToSend = '';

        self.showMultimediaSelectionPreviewDialog = function(event) {
            $mdDialog.show({
                templateUrl: 'multimediaSelectionPreview',
                parent: angular.element(document.body),
                //targetEvent: event,
                escapeToClose: true,
                clickOutsideToClose:false
                //fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            });
        }

        self.closeMultimediaSelectionPreviewDialog = function(){
            $mdDialog.hide();
            $rootScope.multimedia = null;
        };

        // var pictureListener = null;
        // $scope.getPicture = function(){
        //   console.log("in");
        //   pictureListener = setInterval(function(chatList){
        //     if(typeof(chatClientService) != 'undefined' || !null){
        //       var avatarUrl = '';
        //       var chat = chatClientService.chatClient.chatList[self.chatIndex];
        //       var chatClientOwner = chatClientService.chatClient.chatClientOwner;
        //       if(chat.title.length > 0){
        //
        //           avatarUrl = 'images/default_group_avatar.png';
        //       }
        //       else{
        //           chat.participantList.forEach(function (participant) {
        //               if (chatClientOwner !== participant.userId) {
        //                   if(participant.picture === ""){
        //                       avatarUrl = 'images/default_contact_avatar.png';
        //                   }
        //                   else{
        //                       avatarUrl = participant.picture;
        //                   }
        //               }
        //           });
        //       }
        //       $rootScope.$apply();
        //       return avatarUrl;
        //       clearInterval(pictureListener);
        //     }
        //     console.log("interval")
        //   },10);
        //
        // }

        self.showMultimediaSelectionTextDialog = function(event) {
            $mdDialog.show({
                templateUrl: 'multimediaTextView',
                parent: angular.element(document.body),
                //targetEvent: event,
                escapeToClose: true,
                clickOutsideToClose:false
                //fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            });
        }

        self.closeMultimediaSelectionTextDialog = function(){
            $mdDialog.hide();
            $rootScope.multimedia = null;
        };


        self.isMessageListAvailable = function() {
            return chatClientService.isMessageListAvailable();
        }

        //TODO - mover esto al messagelistcontroller
        self.changeMicToSend = function(){
            if(self.textContentToSend.length > 0){
                document.getElementById("microphone").className = "fa fa-send text-center flex-10";
            }
            else{
                document.getElementById("microphone").className = "fa fa-microphone text-center flex-10";
            }
        }

        self.sendMessage = function(){

            if(self.textContentToSend.length > 0 || $rootScope.multimedia){

                var type = '';

                if($rootScope.multimedia){
                    type = 'image';
                }
                else{
                    type = 'im';
                }
                var message = {
                    from: accountService.activeAccount.getUserId(),
                    multimediaUrl: $rootScope.multimedia || '',
                    textContent: self.textContentToSend,
                    timeStamp: new Date().getTime(),
                    type: type
                }

                chatClientService.chatClient.sendMultimediaMessage(chatClientService.selectedChat, message, function(progress, uploadingImage, message){
                  chatClientService.uploadingImage = uploadingImage;
                  chatClientService.progress = progress;
                  chatClientService.opacity = progress/100+0.1;
                  chatClientService.message = message;
                  $rootScope.$digest();
                  if(!uploadingImage){
                    self.textContentToSend = '';
                    self.closeMultimediaSelectionPreviewDialog();
                  }
                });

                if(!$rootScope.multimedia){
                    self.textContentToSend = '';
                }

                //document.getElementById("microphone").className = "fa fa-microphone text-center flex-10";
                //document.getElementById("chatMessageInput").className = "md-icon-float md-block flex-offset-5 flex-85 md-input-focused";

                $state.go('chat', {'chatIndex' : 0, 'chatClientOwner' : chatClientService.chatClient.chatClientOwner});
            }
            // $state.reload();
        }

        self.isMessageFromMe = function(message){
            return message.from == chatClientService.chatClient.chatClientOwner;
        }

        self.showUploadForm = function(){
            angular.element('.fa-paperclip > input[type=file]').trigger('click');
            //angular.element('.hiddenFileInput').trigger('click');
        }

        self.toggleMute = function(value){
          self.newMuteSetting = value;
          chatClientService.selectedChat.toggleNotifications(chatClientService.chatClient.chatClientOwner, value);
        }

        $scope.multimediaSelected = function(element) {

            //self.pictureChosen = true;

            $scope.$apply(function(scope) {

                $rootScope.multimedia = element.files[0];
                var reader = new FileReader();
                reader.onload = function(e) {
                    // handle onload
                    angular.element('#multimediaPreview').attr('src', e.target.result);
                    $scope.multimediaURL = e.target.result;
                };

                reader.readAsDataURL($rootScope.multimedia);
                self.showMultimediaSelectionPreviewDialog();
            });
        };

        self.getChatParticipantUserId = function(){
          var userId = null;
          chatClientService.selectedChat.participantList.forEach(function (participant) {
              if (chatClientService.chatClient.chatClientOwner != participant.userId) {
                  userId = participant.userId;
              }

            });
          return userId;

      };

        self.multimediaClicked = function(messageIndex){
            chatClientService.selectedMessageIndex = messageIndex;
            self.showMultimediaSelectionTextDialog();
            // $('#multimediaPreview').attr('src', multimediaURL);
            // $('.messagePreviewChatMessageInput').attr('style', 'visibility:hidden');
        }


        $location.hash('bottom');
        $anchorScroll();


        if(!chatClientService.selectedChat){
          chatClientService.chatClient.setChatListObserver(function () {

                 var savedChat = JSON.parse(localStorage.getItem('chatSaved'));
                 chatClientService.chatClient.chatList.forEach(function (chat){
                   if(savedChat.chatId == chat.chatId){
                     chatClientService.selectedChat = chat;
                   }
                 });
                 hola();
           });

        }
        else if(chatClientService.selectedChat){
            hola();
        }
        else{
          $state.go('dialer');
        }

        function hola(){
          $scope.selectedChat = chatClientService.selectedChat;
          $scope.$watch(
                  'selectedChat',
                  function (newVal, oldVal) {
                      if (newVal !== oldVal) {

                          $scope.selectedChat.lastMessage = newVal.lastMessage;

                          $timeout(function(){
                              $scope.$apply();
                          });
                      }
                  }, true
              );
          chatClientService.selectedChat.markUnreadMessagesAsRead(chatClientService.chatClient.chatClientOwner);
        }
        // if(chatClientService.chatClient.chatList.length > 0) {
        //
        //     $scope.selectedChat = chatClientService.selectedChat;
        //     localStorage.setItem('chatClientService.selectedChat', JSON.stringify(chatClientService.selectedChat));
        //     $scope.$watch(
        //         'selectedChat',
        //         function (newVal, oldVal) {
        //             if (newVal !== oldVal) {
        //
        //                 $scope.selectedChat.lastMessage = newVal.lastMessage;
        //
        //                 $timeout(function(){
        //                     $scope.$apply();
        //                 });
        //             }
        //         }, true
        //     );
        //
        //     chatClientService.selectedChat.markUnreadMessagesAsRead(chatClientService.chatClient.chatClientOwner);
        // }
        // else{
        //   console.log(JSON.parse(localStorage.getItem('chatClientService.selectedChat')));
        //     $state.go('dialer');
        // }
    }]);
})();
