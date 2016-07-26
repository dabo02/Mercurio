angular.module('users')
.controller('ChatController', function($scope) {
    this.changeMicToSend = function(){
        if($scope.microphone.length>0){
            document.getElementById("microphone").className = "fa fa-send text-center flex-10";
        }
        else{
            document.getElementById("microphone").className = "fa fa-microphone text-center flex-10";
        }
    }

    this.sendMessage = function(){

        $scope.microphone = "";
    }
});