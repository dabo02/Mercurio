'use strict';

angular.module('users')
	.directive('chat',function(){
		return {
        templateUrl:'src/chat/chat.html',
        restrict: 'E',
        replace: false,
    	}
	});