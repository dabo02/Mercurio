/**
 * Created by brianlandron on 9/27/16.
 */

(function(){

    'use strict';

    angular.module('mercurio').controller('ChatGroupDetailsController', ['$scope', '$stateParams', 'chatClientService', 'accountService', '$mdDialog', function($scope, $stateParams, chatClientService, accountService, $mdDialog){

        var self = this;
        self.chatIndex = $stateParams.chatIndex;
        self.chatClient = chatClientService.chatClient;

        self.showChatGroupDetailsDialog = function(event) {
            $mdDialog.show({
                templateUrl: 'chatGroupDetails',
                parent: angular.element(document.body),
                targetEvent: event,
                escapeToClose: true,
                clickOutsideToClose:true
                //fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            });
        }

        self.closeChatGroupDetailsDialog = function(){
            $mdDialog.hide()
        };

        self.exitGroup = function(){
            console.log('exiting group');
        };

        self.saveChatGroupDetails = function(){
            console.log('saving group details');
        }

    }]);
})();