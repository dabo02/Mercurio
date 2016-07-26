'use strict';

       angular.module('users')
       	.directive('dialer',function(){
       		return {
               templateUrl:'src/dialer/dialer.html',
               restrict: 'E',
               replace: false,
           	}
       	});