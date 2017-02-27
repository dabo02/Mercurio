/**
 * Created by brianlandron on 9/14/16.
 */
(function() {

    'use strict';

    angular.module('mercurio').controller('AboutDialogController', ['$scope', '$mdDialog', function($scope, $mdDialog){

        var self = this;


        self.showAboutDialog = function(event){

            $mdDialog.show({
                templateUrl: 'aboutDialog',
                parent: angular.element(document.body),
                targetEvent: event,
                escapeToClose: true,
                clickOutsideToClose:true
                //fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            });
        }

        self.closeAboutDialog = function(){
            $mdDialog.hide()
        };

    }]);
}());