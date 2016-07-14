'use strict';

angular.module('users')
	.directive('leftSidebar',function(){
		return {
        templateUrl:'src/leftSidebar.html',
        restrict: 'E',
        replace: false,
    	}
	});