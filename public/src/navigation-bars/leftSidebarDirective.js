(function(){

	'use strict';

	angular.module('mercurio').directive('leftSidebar',function(){
		return {
			templateUrl:'src/navigation-bars/leftSidebar.html',
			restrict: 'E',
			replace: false
		}
	});
}());

