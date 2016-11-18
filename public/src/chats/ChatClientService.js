/**
 * Created by brianlandron on 9/14/16.
 */
(function(){

    'use strict';

    angular.module('mercurio').service('chatClientService', ['$state', '$location', '$anchorScroll', function($state, $location, $anchorScroll){

        var self = this;
        self.chatClient;

        self.chatIsReadyToSendObserver = function(){
            $state.go('chat', {'chatIndex' : 0, 'chatClientOwner' : self.chatClient.chatClientOwner});
        };

        self.instantiateChatClient = function(userId){
            self.chatClient = new MercurioChatClient(userId, self.onMessageReceived);
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
                        var newIndex = parseInt($state.params.chatIndex, 10) + 1;
                        $state.go('chat', {'chatIndex' : newIndex, 'chatClientOwner' : self.chatClient.chatClientOwner});
                    }
                    else if($state.params.chatIndex == receivedChatIndex && $state.params.chatIndex != 0){
                        $state.go('chat', {'chatIndex' : 0, 'chatClientOwner' : self.chatClient.chatClientOwner});
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