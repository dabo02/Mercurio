/**
 * Created by brianlandron on 9/14/16.
 */
(function() {

    'use strict';

    angular.module('mercurio').controller('NavigationController', ['$scope', 'authenticationService', 'accountService', '$mdSidenav', '$location', 'phoneService', function($scope, authenticationService, accountService, $mdSidenav, $location, phoneService){

        var self = this;
        self.accountService = accountService;
        //Set greetings message
        var date = new Date;
        var hour = date.getHours()
        if(hour>5 && hour<12){
          $scope.greetingMessage="Good morning, ";
        }
        else if(hour>=12 && hour<6){
          $scope.greetingMessage="Good afternoon, ";
        }
        else{
          $scope.greetingMessage="Good night, ";
        }

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

        self.homeLinkClicked = function () {
            location.replace("#/dialer");
        };

        self.contactsLinkClicked = function () {
            location.replace("#/contacts");
        };

        self.crmManagerLinkClicked = function () {
            location.replace("#/crm-manager");
        };

        self.toggleLeftSidebar = function(){
            if(!$mdSidenav('left').isOpen())
              $mdSidenav('left').toggle();
        };

        self.viewRecentCallsButtonClicked = function(){
            self.viewingRecentCalls = true;
            self.viewingRecentChats = false;
            //change class for selected to be in whit
        };

        self.viewRecentChatsButtonClicked = function(){
            phoneService.missedCallsCounter= 0;
            self.viewingRecentCalls = false;
            self.viewingRecentChats = true;
        };

    }]);
}());
