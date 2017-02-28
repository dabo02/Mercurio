/**
 * Created by brianlandron on 9/14/16.
 */
(function(){

    'use strict';

    angular.module('mercurio').service('chatClientService', ['$state', '$location', '$anchorScroll', '$rootScope', '$timeout', function($state, $location, $anchorScroll, $rootScope, $timeout){

        var self = this;
        self.chatClient;
        self.selectedMessageIndex = null;
        self.selectedChat = null;

        self.chatIsReadyToSendObserver = function(newChat){
            self.selectedChat = newChat;
            localStorage.setItem('chatSaved', JSON.stringify(self.selectedChat));
            //$state.go('chat', {'chatIndex' : 0, 'chatClientOwner' : self.chatClient.chatClientOwner});
            setTimeout(function(){
              $rootScope.$apply();
            },1000);
            if($state.current.name == 'chat'){
                $state.reload();
            }
            else{
                $state.go('chat');
            }
        };

        self.instantiateChatClient = function(userId){
            self.chatClient = new MercurioChatClient(userId, self.onMessageReceived);
            //TODO repeat this for:
           // accountService.activeAccount.contactManager.contactList
           // phoneService.phone.recentCallList
           // crmService.crmManager.crmList
           // Spinner Variable

           $rootScope.chatListIsReady = false;
           $rootScope.chatList = self.chatClient.chatList;

          //  $rootScope.$watch('chatList', function () {
          //      if($rootScope.chatList.length > 0){
          //          $rootScope.chatListIsReady = true;
          //          console.log("chat")
          //      }
          //  });
        }

        self.instantiateSelectedChat = function(chat){
          var newChat = new MercurioChat (chat.chatId, chat.participantCount, null,
    					chat.lastMessage, chat.settings, null, chat.title, self.chatClientOwner);
              newChat.participantList = chat.participantList;
              newChat.messageList = chat.messageList;
              return newChat;
        }

        self.onMessageReceived = function(receivedChat, index){

            $location.hash('bottom'); //identify that this bottom means the message list bottom of current chat - use index
            $anchorScroll();
            var notify;
            var sender;
            if(receivedChat.lastMessage.from !== self.chatClient.chatClientOwner){
              console.log(receivedChat);
                receivedChat.participantList.forEach(function(participant){
                  if(participant.userId == receivedChat.lastMessage.from){
                    sender= participant;
                  }
                })
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
                        $state.go('chat');//, {'chatIndex' : newIndex, 'chatClientOwner' : self.chatClient.chatClientOwner});
                    }
                    else if($state.params.chatIndex == receivedChatIndex){

                        //mark message as read
                        //self.chatClient.chatList[$state.params.chatIndex].markAllMessagesAsRead(self.chatClient.chatClientOwner);

                        // I am currently viewing the received chat and it is now positioned at index 0 so the route
                        // is updated to continue viewing it
                        if(receivedChatIndex == 0){
                            $state.go('chat');//$state.reload();
                        }
                        else{
                            $state.go('chat');//$state.go('chat', {'chatIndex' : 0, 'chatClientOwner' : self.chatClient.chatClientOwner});
                        }
                    }
                }
                Notification.requestPermission();
                notify = new Notification('New Message Recieved from ' + sender.firstName + ' ' + sender.lastName, {
                  body: receivedChat.lastMessage.textContent,
                  icon: sender.picture
                });
                notify.onclick = function(event){
                  var chatURL =  "http://localhost:3000/#/chat/" + receivedChatIndex + "/" + self.chatClient.chatClientOwner
                  window.open(chatURL, "_self");
                }
                 setTimeout(notify.close.bind(notify), 4000);
            }
            setTimeout(function(){
            $rootScope.$apply();
          }, 100);
        }

        self.isChatListAvailable = function(){

            if($rootScope.chatList.length > 0){
                return true;
            }
            else{
                return false;
            }
        }
    }]);

})();
