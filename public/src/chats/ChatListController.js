/**
 * Created by brianlandron on 9/20/16.
 */
(function(){

    'use strict';

    angular.module('mercurio').controller('ChatListController', ['$scope', '$state', 'chatClientService', '$mdDialog', function($scope, $state, chatClientService, $mdDialog){

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

            if($state.params.chatIndex == index){
                chatClientService.chatClient.markAllMessagesAsRead(index);
                return;
            }


            if(chat.messageList[chat.messageList.length - 1].read[chatClientService.chatClient.chatClientOwner] == 0){
                return {
                    "font-weight":"bold"
                };
            }
            //ng-if="chat.messageList[0].hasMessage[chatClientService.chatClient.chatClientOwner]"
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
    }]);
})();