'use strict';

angular.module('users')
	.directive('editProfile',function(){
		return {
        templateUrl:'src/contacts/editProfile.html',
        restrict: 'E',
        replace: false,
    	}
	});