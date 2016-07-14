'use strict';

angular.module('users')
	.directive('chats',function(){
		return {
        templateUrl:'src/chat/chats.html',
        restrict: 'E',
        replace: false,
    	}
	});