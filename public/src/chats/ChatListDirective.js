(function(){

	'use strict';

	angular.module('mercurio').directive('chatList',function(){
		return {
			templateUrl:'src/chats/chatList.html',
			restrict: 'E',
			replace: false
		}
	});
})();

