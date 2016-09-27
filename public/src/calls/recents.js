'use strict';

angular.module('users')
	.directive('recents',function(){
		return {
        templateUrl:'src/calls/recents.html',
        restrict: 'E',
        replace: false,
    	}
	});
