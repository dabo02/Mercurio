/**
 * Created by brianlandron on 9/14/16.
 */
(function(){

    'use strict';

    angular.module('mercurio').service('chatClientService', ['$stateParams', '$location', '$anchorScroll', function($stateParams, $location, $anchorScroll){

        var self = this;
        self.chatClient;

        self.instantiateChatClient = function(userId){
            self.chatClient = new MercurioChatClient(userId, self.onMessageReceived);
        }

        self.onMessageReceived = function(message){
            console.log('message has been received');
            //playSound('random')
            if(true){
                $location.hash('bottom');
                $anchorScroll();
            }

            if(message.from !== self.chatClient.chatClientOwner){
                var sound = new Audio("audio/pickup_coin.wav");
                sound.play();
                sound.currentTime=0;
            }

            //$scope.apply();

            /*function playSound(ringtone){
                stopSound();
                sound = new Audio("audio/"+ ringtone + ".mp3");
                sound.play();
                sound.currentTime=0;
            }

            function stopSound(){
                sound.pause();
            }*/

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