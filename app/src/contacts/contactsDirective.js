'use strict';

angular.module('users')
	.directive('contacts',function(){
		return {
        templateUrl:'src/contacts/contacts.html',
        restrict: 'E',
        replace: false,
    	}
	});