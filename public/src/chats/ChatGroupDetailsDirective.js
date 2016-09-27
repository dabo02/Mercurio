/**
 * Created by brianlandron on 9/27/16.
 */
(function(){

    'use strict';

    angular.module('mercurio').directive('chatGroupDetails',function(){
        return {
            templateUrl:'src/chats/chatGroupDetails.html',
            restrict: 'E',
            replace: false
        }
    });
})();

