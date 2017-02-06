/**
 * Created by brianlandron on 12/1/16.
 */
(function(){

    'use strict';

    angular.module('mercurio').controller('CallDetailsController', ['$scope', '$state', 'phoneService', '$mdDialog', function($scope, $state, phoneService, $mdDialog){

        var self = this;
        self.phone = phoneService.phone;

        self.showCallDetailsDialog = function(event) {

            $mdDialog.show({
                templateUrl: 'callDetailsDialog',
                parent: angular.element(document.body),
                targetEvent: event,
                escapeToClose: true,
                clickOutsideToClose:true
                //fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            });
        }

        self.closeCallDetailsDialog = function(){
            $mdDialog.hide()
        };

    }]);
})();