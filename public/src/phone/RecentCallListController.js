/**
 * Created by brianlandron on 9/20/16.
 */
(function(){

    'use strict';

    angular.module('mercurio').controller('RecentCallListController', ['$scope', '$state', 'phoneService', '$mdDialog', function($scope, $state, phoneService, $mdDialog){

        var self = this;
        self.phone = phoneService.phone;

        $scope.selectedCallIndex = undefined;

        $scope.selectCallIndex = function (index) {
            if ($scope.selectedCallIndex !== index) {
                $scope.selectedCallIndex = index;
            }
            else {
                $scope.selectedCallIndex = undefined;
            }
        };

        self.recentCalls =
          {
            "name":"Ralo@optivon.net",
            "number":"1234",
            "calls":
            [
              {
                "answered" : true,
                "duration" : "00:04",
                "from" : "7873042972",
                "incoming" : false,
                "timeStamp" : 1482349829206,
                "to" : "7873042704"
              },
              {
                "answered" : false,
                "duration" : "00:04",
                "from" : "7873042972",
                "incoming" : true,
                "timeStamp" : 1482349829206,
                "to" : "7873042704"
              },
              {
                "answered" : true,
                "duration" : "00:04",
                "from" : "7873042972",
                "incoming" : false,
                "timeStamp" : 1482349829206,
                "to" : "7873042704"
              },
              {
                "answered" : false,
                "duration" : "00:04",
                "from" : "7873042972",
                "incoming" : true,
                "timeStamp" : 1482349829206,
                "to" : "7873042704"
              },
              {
                "answered" : true,
                "duration" : "00:04",
                "from" : "7873042972",
                "incoming" : true,
                "timeStamp" : 1482349829206,
                "to" : "7873042704"
              },
              {
                "answered" : false,
                "duration" : "00:04",
                "from" : "7873042972",
                "incoming" : false,
                "timeStamp" : 1482349829206,
                "to" : "7873042704"
              },
              {
                "answered" : true,
                "duration" : "00:04",
                "from" : "7873042972",
                "incoming" : false,
                "timeStamp" : 1482349829206,
                "to" : "7873042704"
              }
            ]
          };

        self.showDeleteConfirm = function(event, callIndex) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title('Are you sure you want to delete this call from your recents list?')
                .ariaLabel('delete confirm')
                .targetEvent(event)
                .ok('Delete')
                .cancel('Cancel');

            $mdDialog.show(confirm).then(function() {
                //$scope.status = 'You decided to get rid of your debt.';
                phoneService.phone.deleteCalls([callIndex]);
                //$state.go('dialer');
            }, function() {
                //$scope.status = 'You decided to keep your debt.';
            });
        };

    }]);
})();
