(function() {

	'use strict';

	angular.module('mercurio').controller('DialerController', ['$scope', 'phoneService', 'accountService', '$state', '$mdDialog', function ($scope, phoneService, accountService, $state, $mdDialog) {

		$scope.number = "";

		var self = this;

		self.dialing = false;

		self.makeCall = function (contacts) {

			if (contacts.length > 0) {
				phoneService.phone.addNewCall(false,contacts[0].phone, accountService.activeAccount.phone, false, new Date().getTime());
				$state.go('call', {'callIndex' : 0});
			}
			else if(phoneService.contactSearchString.length > 0){
				phoneService.phone.addNewCall(false,phoneService.contactSearchString, accountService.activeAccount.phone, false, new Date().getTime());
				$state.go('call', {'callIndex' : 0});
			}
			else{
				return;
			}
		}



		//self.dial = function (){
		//		if($scope.dialInput.length>0){
		//			var temp = $scope.dialInput.replace("(","").replace(")","").replace(" ","").replace("-","")
		//		 	+ number.toString();
		//		}
		//		else{
		//			var temp = number.toString();
		//		}
		//
		//		if(temp.length <3){
		//			$scope.dialInput = temp;
		//		}
		//		else if(temp.length==3){
		//			$scope.dialInput = "(" + temp + ")";
		//		}
		//		else if(temp.length <7){
		//			$scope.dialInput = "(" + temp.substring(0,3) + ") " + temp.substring(3);
		//		}
		//		else if(temp.length <11){
		//			$scope.dialInput = "(" + temp.substring(0,3) + ") " + temp.substring(3,6)
		//			+ "-"+temp.substring(6);
		//		}
		//		else if(temp.length ==11 && temp.substring(0,1)=="1"){
		//			$scope.dialInput = "1(" + temp.substring(1,4) + ") "
		//			+ temp.substring(4,7) + "-" + temp.substring(7,11);
		//		}
		//
		//		playDialerSound($scope.number);
		//	}
		//
		//	function backspace(){
		//		if($scope.dialInput.length > 0){
		//			$scope.dialInput = $scope.dialInput.substring(0,document.getElementById("dial-input").value.length-1);
		//		}
		//		playBackspaceSound();
		//	}
		//
		//	function playDialerSound(key){
		//		var sound = new Audio("sounds/"+key.replace("#","h")+".wav");
		//		sound.play();
		//		sound.currentTime=0;
		//	}
		//
		//	function playBackspaceSound(){
		//		var sound = new Audio("sounds/backspace.wav");
		//		sound.play();
		//		sound.currentTime=0;
		//	}

	}])
})();


