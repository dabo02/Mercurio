/**
 * Created by brianlandron on 9/14/16.
 */
(function(){

    'use strict';

    angular.module('mercurio').service('chatClientService', ['$state', '$location', '$anchorScroll', '$rootScope', function($state, $location, $anchorScroll, $rootScope){

        var self = this;
        self.chatClient;
        self.selectedMessageIndex = null;

        self.chatIsReadyToSendObserver = function(){
            $state.go('chat', {'chatIndex' : 0, 'chatClientOwner' : self.chatClient.chatClientOwner});
        };

        self.instantiateChatClient = function(userId){
            self.chatClient = new MercurioChatClient(userId, self.onMessageReceived);

            //TODO repeat this for:
            // accountService.activeAccount.contactManager.contactList
            // phoneService.phone.recentCallList
            // crmService.crmManager.crmList

            $rootScope.chatListIsReady = false;
            $rootScope.chatList = self.chatClient.chatList;

            var unwatchChatList = $rootScope.$watch('chatList', function (chatList) {

                if(chatList.length > 0){
                    $rootScope.chatListIsReady = true;
                    unwatchChatList();
                }

            });
        }

        self.onMessageReceived = function(receivedChat, index){

            $location.hash('bottom'); //identify that this bottom means the message list bottom of current chat - use index
            $anchorScroll();

            if(receivedChat.lastMessage.from !== self.chatClient.chatClientOwner){

                if(!receivedChat.settings.mute){
                    var sound = new Audio("audio/pickup_coin.wav");
                    sound.play();
                    sound.currentTime=0;
                }


                var receivedChatIndex = index;

                if($state.params.chatIndex != undefined && receivedChatIndex >= 0){
                    if($state.params.chatIndex < receivedChatIndex){
                        // received chat is listed after the chat i am currently viewing
                        // move the chat i'm viewing one spot down the list and update the route to continue viewing it
                        var newIndex = parseInt($state.params.chatIndex, 10) + 1;
                        $state.go('chat', {'chatIndex' : newIndex, 'chatClientOwner' : self.chatClient.chatClientOwner});
                    }
                    else if($state.params.chatIndex == receivedChatIndex){

                        //mark message as read
                        //self.chatClient.chatList[$state.params.chatIndex].markAllMessagesAsRead(self.chatClient.chatClientOwner);

                        // I am currently viewing the received chat and it is now positioned at index 0 so the route
                        // is updated to continue viewing it
                        if(receivedChatIndex == 0){
                            $state.reload();
                        }
                        else{
                            $state.go('chat', {'chatIndex' : 0, 'chatClientOwner' : self.chatClient.chatClientOwner});
                        }
                    }
                }
            }
        }

        self.isChatListAvailable = function(){

            if(self.chatClient.chatList.length > 0){
                return true;
            }
            else{
                return false;
            }
        }
    }]);

})();
