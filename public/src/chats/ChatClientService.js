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

        $rootScope.chatList = [];

        self.chatAddedToListObserver = function(chat){
            console.log(chat);
            binaryInsert(chat, $rootScope.chatList);
        }

        function binaryInsert(value, array, startVal, endVal){

            var length = array.length;
            var start = typeof(startVal) != 'undefined' ? startVal : 0;
            var end = typeof(endVal) != 'undefined' ? endVal : length - 1;//!! endVal could be 0 don't use || syntax
            var m = start + Math.floor((end - start)/2);

            if(!value.lastMessage){
                return;
            }

            if(length == 0){
                array.push(value);
                return;
            }

            if(value.lastMessage.timeStamp < array[end].lastMessage.timeStamp){
                array.splice(end + 1, 0, value);
                return;
            }

            if(value.lastMessage.timeStamp > array[start].lastMessage.timeStamp){//!!
                array.splice(start, 0, value);
                return;
            }

            if(start >= end){
                return;
            }

            if(value.lastMessage.timeStamp > array[m].lastMessage.timeStamp){
                binaryInsert(value, array, start, m - 1);
                return;
            }

            if(value.lastMessage.timeStamp < array[m].lastMessage.timeStamp){
                binaryInsert(value, array, m + 1, end);
                return;
            }

            //we don't insert duplicates
        }

        self.chatClient = function(){
            if(self.selectedChat){
                if(self.selectedChat.constructor.name == 'SMSChat'){
                    return self.smsChatClient;
                }
                else if(self.selectedChat.constructor.name == 'MercurioChat'){
                    return self.mercurioChatClient;
                }
                else{
                    return self.mercurioChatClient;
                }
            }
            else{
                return self.mercurioChatClient;
            }
        };

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
            self.mercurioChatClient = new MercurioChatClient(userId, self.onMessageReceived, self.chatAddedToListObserver);
            self.smsChatClient = new SMSChatClient(userId, self.onMessageReceived, self.chatAddedToListObserver);

            //self.chatClient = self.smsChatClient;

           // Spinner Variable

           $rootScope.chatListIsReady = false;
           //$rootScope.chatList = self.chatClient().chatList;

          //  $rootScope.$watch('chatList', function () {
          //      if($rootScope.chatList.length > 0){
          //          $rootScope.chatListIsReady = true;
          //          console.log("chat")
          //      }
          //  });
        }

        // TODO replace with call to instantiateChat()
        self.instantiateSelectedChat = function(chat){
          var newChat = new MercurioChat (chat.chatId, chat.participantCount, null,
    					chat.lastMessage, chat.settings, null, chat.title, self.chatClientOwner, chat.groupPicture);
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
                receivedChat.participantList.forEach(function(participant){
                  if(participant.participantId == receivedChat.lastMessage.from){
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

                Notification.requestPermission(function(permission){
                  if(permission === "granted"){
                    var options = {
                      body: receivedChat.lastMessage.textContent,
                      icon: sender.picture
                      }
                  notify = new Notification('New Message Received from ' + sender.firstName + ' ' + sender.lastName, options);
                  notify.onclick = function(event){
                    var chatURL =  "http://localhost:3000/#/dialer"
                    window.open(chatURL);
                  }
                   setTimeout(notify.close.bind(notify), 4000);
                 }
                });

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
