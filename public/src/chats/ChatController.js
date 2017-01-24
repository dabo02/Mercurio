/**
 * Created by brianlandron on 9/20/16.
 */
(function(){

    'use strict';

    angular.module('mercurio').controller('ChatController', ['$rootScope', '$scope', '$stateParams', 'chatClientService', 'accountService', '$location', '$anchorScroll', '$state', '$mdDialog', function($rootScope, $scope, $stateParams, chatClientService, accountService, $location, $anchorScroll, $state, $mdDialog){

        var self = this;
        self.chatIndex = $stateParams.chatIndex;
        self.chatClientService = chatClientService;
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
                var message = {
                    from: accountService.activeAccount.getUserId(),
                    multimediaUrl: $rootScope.multimedia,
                    textContent: self.textContentToSend,
                    timeStamp: new Date().getTime()
                }

                chatClientService.chatClient.sendMultimediaMessage(self.chatIndex, message);
                self.textContentToSend = '';
                //document.getElementById("microphone").className = "fa fa-microphone text-center flex-10";
                //document.getElementById("chatMessageInput").className = "md-icon-float md-block flex-offset-5 flex-85 md-input-focused";

                if($rootScope.multimedia){
                    self.closeMultimediaSelectionPreviewDialog();
                }

                $state.go('chat', {'chatIndex' : 0, 'chatClientOwner' : chatClientService.chatClient.chatClientOwner});
            }
            $state.reload();
        }

        self.isMessageFromMe = function(message){
            return message.from == chatClientService.chatClient.chatClientOwner;
        }

        self.showUploadForm = function(){
            angular.element('.fa-paperclip > input[type=file]').trigger('click');
            //angular.element('.hiddenFileInput').trigger('click');
        }

        self.toggleMute = function(value){
            chatClientService.chatClient.chatList[$stateParams.chatIndex]
                .toggleNotifications(chatClientService.chatClient.chatClientOwner, value);
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
          chatClientService.chatClient.chatList[self.chatIndex].participantList.forEach(function (participant) {
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

        if(chatClientService.chatClient.chatList.length > 0){
            chatClientService.chatClient.chatList[$stateParams.chatIndex]
                .markAllMessagesAsRead(chatClientService.chatClient.chatClientOwner);
        }

        $location.hash('bottom');
        $anchorScroll();

    }]);
})();
