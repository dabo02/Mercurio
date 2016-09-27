/**
 * Created by brianlandron on 9/27/16.
 */

(function(){

    'use strict';

    angular.module('mercurio').controller('ChatGroupDetailsController', ['$scope', '$stateParams', 'chatClientService', 'accountService', '$location', '$anchorScroll', function($scope, $stateParams, chatClientService, accountService, $location, $anchorScroll){

        var self = this;
        self.chatIndex = $stateParams.chatIndex;

        self.saveGroupInfo = function(){
            console.log($stateParams);
        }
    }]);
})();