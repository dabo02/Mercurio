/**
 * Created by brianlandron on 9/14/16.
 */
(function() {

    'use strict';

    angular.module('mercurio').controller('NavigationController', ['$scope', 'authenticationService', 'accountService', '$mdSidenav', '$location', function($scope, authenticationService, accountService, $mdSidenav, $location){

        var self = this;
        self.profileImage = "images/contact0Dressed.jpg";
        self.viewingRecentCalls = true;
        self.viewingRecentChats = false;

        if($location.path().length>3){
            $scope.currentNavItem = $location.path();
        }

        $scope.navClass = function (page) {
            var currentRoute = $location.path().substring(1) || 'all';
            return page === currentRoute ? 'active' : '';
        };

        self.isAccountAvailable = function(){
            return accountService.isAccountAvailable();
        };

        self.contactsLinkClicked = function () {
            location.replace("#/contacts");
        };

        self.toggleLeftSidebar = function(){
            $mdSidenav('left').toggle();
        };

        self.viewRecentCallsButtonClicked = function(){
            self.viewingRecentCalls = true;
            self.viewingRecentChats = false;
            //change class for selected to be in whit
        };

        self.viewRecentChatsButtonClicked = function(){
            self.viewingRecentCalls = false;
            self.viewingRecentChats = true;
        };

    }]);
}());