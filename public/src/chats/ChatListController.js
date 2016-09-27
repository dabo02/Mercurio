/**
 * Created by brianlandron on 9/20/16.
 */
(function(){

    'use strict';

    angular.module('mercurio').controller('ChatListController', ['$scope', '$state', 'chatClientService', function($scope, $state, chatClientService){

        var self = this;
        self.chatClient = chatClientService.chatClient;

        self.isChatListAvailable = function() {
            return chatClientService.isChatListAvailable();
        }

        self.viewChat = function(chatIndex){
            console.log('view chat clicked: chat index = ' + chatIndex);
            $state.go('chat', {'chatIndex' : chatIndex, 'chatClientOwner' : chatClientService.chatClient.chatClientOwner});
        }

        self.getTextPreviewClass = function(chat, index){

            if(chat.messageList[chat.messageList.length - 1].read[chatClientService.chatClient.chatClientOwner] == 0){
                return {
                    "font-weight":"bold"
                };
            }
            //ng-if="chat.messageList[0].hasMessage[chatClientService.chatClient.chatClientOwner]"
        }

        self.chatClient.chatList.forEach(function(chat){
            $scope.$watch(function () {
                return chat.lastMessage;
            }, function (newVal, oldVal) {
                if ( newVal !== oldVal ) {
                    chat.lastMessage = newVal;
                }
            });
        })

    }]);
})();