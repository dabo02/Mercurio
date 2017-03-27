'use strict';

angular.module('users')
	.directive('videoCall', function(){
		return {
			templateUrl:'src/phone/videoCall.html',
			restrict: 'E',
			replace: false,
		}
	});