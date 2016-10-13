/**
 * Created by brianlandron on 9/20/16.
 */
(function(){

    'use strict';

    angular.module('mercurio').controller('RecentCallListController', ['$scope', '$state', 'phoneService', function($scope, $state, phoneService){

        var self = this;
        self.phone = phoneService.phone;

        $scope.selectedUserIndex = undefined;
        $scope.selectUserIndex = function (index) {
            if ($scope.selectedUserIndex !== index) {
                $scope.selectedUserIndex = index;
            }
            else {
                $scope.selectedUserIndex = undefined;
            }
        };

    }]);
})();