'use strict';
angular.module('users')
	.directive('rightSidebarList',function(){
		return {
       templateUrl:'src/phone/rightSidebarList.html',
       restrict: 'E',
       scope:{
         type : "=",
         calls : "=",
				 chats : "="
       },
       replace: false
   	}
});
