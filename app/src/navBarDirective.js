'use strict';

angular.module('users')
	.directive('navBar',function(){
		return {
        templateUrl:'src/navBar.html',
        restrict: 'E',
        replace: false,
    	}
	});