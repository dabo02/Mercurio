/**
 * Created by brianlandron on 9/20/16.
 */
(function(){

    'use strict';

    angular.module('mercurio').controller('ChatController', ['$scope', '$stateParams', 'chatClientService', 'accountService', '$location', '$anchorScroll', function($scope, $stateParams, chatClientService, accountService, $location, $anchorScroll){

        var self = this;
        self.chatIndex = $stateParams.chatIndex;
        self.chatClient = chatClientService.chatClient;
        /*self.chat = chatClientService.chatClient.chatList[self.chatIndex];
        self.messageList = self.chat.messageList;
        self.participantList = self.chat.participantList;
        self.chatClientOwner = $stateParams.chatClientOwner*/;
        self.textContentToSend = '';

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

            if(self.textContentToSend.length > 0){
                var message = {
                    from: accountService.activeAccount.getUserId(),
                    multimediaUrl: "",
                    textContent: self.textContentToSend,
                    timeStamp: new Date().getTime()
                }

                chatClientService.chatClient.sendMessage(self.chatIndex, message);
                self.textContentToSend = '';
                document.getElementById("microphone").className = "fa fa-microphone text-center flex-10";
                //document.getElementById("chatMessageInput").className = "md-icon-float md-block flex-offset-5 flex-85 md-input-focused";
            }

        }

        self.isMessageFromMe = function(message){
            return message.from === self.chatClient.chatClientOwner;
        }


        self.chatClient.markAllMessagesAsRead(self.chatIndex);
        $location.hash('bottom');
        $anchorScroll();

    }]);
})();