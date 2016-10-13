/**
 * Created by brianlandron on 10/4/16.
 */
(function(){

    'use strict';

    angular.module('mercurio').directive('addChatForm',function(){
        return {
            templateUrl:'src/chats/addChatForm.html',
            restrict: 'E',
            replace: false
        }
    });
})();