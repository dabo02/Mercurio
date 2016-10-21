/**
 * Created by brianlandron on 10/14/16.
 */


/**
 * Created by brianlandron on 9/20/16.
 */
(function(){

    'use strict';

    angular.module('mercurio').controller('CreateChatController', ['$rootScope', '$scope', 'chatClientService', '$mdDialog', 'accountService', function($rootScope, $scope, chatClientService, $mdDialog, accountService){

        var self = this;
        self.chatClient = chatClientService.chatClient;
        self.groupChatCheckbox = false;

        self.newContactChipSelected = function(contacts){
            console.log('new contact chip selected');
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

        self.closeCreateChatDialog = function(){
            $mdDialog.hide()
        };

        self.createNewChat = function(contacts){

            var participants = [];

            contacts.forEach(function(contact){
                if(contact.userId != '' || contact.userId !== undefined){
                    participants.push(contact.userId);
                }
            });

            participants.push(chatClientService.chatClient.chatClientOwner);

            if(participants.length > 1){

                if(participants.length > 2 && !self.groupChatCheckbox){
                    self.groupChatCheckbox = true;
                    return;
                }

                var chatInfo = {
                    lastMessage: {},
                    timeStamp: new Date().getTime(),
                    title: self.title || '',
                    participantCount: participants.length,
                    settings: {mute:false}
                };

                chatClientService.chatClient.createChat(chatInfo, participants, chatClientService.chatIsReadyToSendObserver);
                self.closeCreateChatDialog();
            }

        };

        $scope.$watch(
            "asyncContacts",
            function( newValue, oldValue ) {
                console.log('contact added');
            }, true
        );

        //  ???
        self.chatClient.chatList.forEach(function(chat){
            $scope.$watch(function () {
                return chat.lastMessage;
            }, function (newVal, oldVal) {
                if ( newVal !== oldVal ) {
                    chat.lastMessage = newVal;
                }
            });
        });


    }]);
})();