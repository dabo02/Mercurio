'use strict';

angular.module('users')
	.directive('navBar',function(){
		return {
        templateUrl:'src/navigation-bars/navBar.html',
        restrict: 'E',
        replace: false
    	}
	});