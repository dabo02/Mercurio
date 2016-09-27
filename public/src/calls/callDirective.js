'use strict';

angular.module('users')
	.directive('call',function(){
		return {
        templateUrl:'src/calls/call.html',
        restrict: 'E',
        replace: false,
    	}
	});