'use strict';

angular.module('users')
	.directive('rightSidebar',function(){
		return {
        templateUrl:'src/rightSidebar.html',
        restrict: 'E',
        replace: false,
    	}
	});