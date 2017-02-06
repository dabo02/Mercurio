/**
 * Created by brianlandron on 9/20/16.
 */
(function(){

    'use strict';

    angular.module('mercurio').controller('ChatListController', ['$scope', '$state', 'chatClientService', '$mdDialog', function($scope, $state, chatClientService, $mdDialog){

        var self = this;
        self.chatClient = chatClientService.chatClient;
        self.chatClientService = chatClientService;

        self.topDirections = ['left', 'up'];
        self.bottomDirections = ['down', 'right'];

        self.isOpen = false;

        self.availableModes = ['md-fling', 'md-scale'];
        self.selectedMode = 'md-fling';

        self.availableDirections = ['up', 'down', 'left', 'right'];
        self.selectedDirection = 'up';
        self.counter=0;

        self.isChatListAvailable = function() {
            return chatClientService.isChatListAvailable();
        }
        
        self.chatListCounter = function(counter){
          self.counter++;
        }

        self.viewChat = function(chatIndex){
            chatClientService.selectedChat = chatClientService.chatClient.chatList[chatIndex];
            $state.go('chat', {'chatIndex' : chatIndex, 'chatClientOwner' : chatClientService.chatClient.chatClientOwner});
        }

        self.getTextPreviewClass = function(chat, index){
            //if($state.params.chatIndex == index){
            //    chatClientService.chatClient.chatList[index].markAllMessagesAsRead(chatClientService.chatClient.chatClientOwner);
            //    return;
            //}


            if(chat.messageList[chat.messageList.length - 1].read == 0){
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

        self.showDeleteConfirm = function(event, chatIndex) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title('Are you sure you want to delete this chat from your chat list?')
                .ariaLabel('delete confirm')
                .targetEvent(event)
                .ok('Delete')
                .cancel('Cancel');

            $mdDialog.show(confirm).then(function() {
                //$scope.status = 'You decided to get rid of your debt.';
                chatClientService.chatClient.deleteChats([chatIndex]);
                $state.go('dialer');
            }, function() {
                //$scope.status = 'You decided to keep your debt.';
            });
        };
    }]);
})();
