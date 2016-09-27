'use strict';

angular.module('users')
	.directive('rightSidebar',function(){
		return {
        templateUrl:'src/navigation-bars/rightSidebar.html',
        restrict: 'E',
        replace: false
    	}
	});