/**
 * Created by brianlandron on 9/20/16.
 */
(function(){

    'use strict';

    angular.module('mercurio').controller('RecentCallListController', ['$scope', '$state', 'phoneService', '$mdDialog', '$rootScope', function($scope, $state, phoneService, $mdDialog, $rootScope){

        var self = this;
        self.phoneService = phoneService;
        $scope.phoneService = self.phoneService;
        $scope.currentNavItem = "all";
        $scope.sidebarNavItem = "all";

        $scope.selectedCallIndex = undefined;
        filterSidebarCalls();

        $scope.selectCallIndex = function (index) {
            if ($scope.selectedCallIndex !== index) {
                $scope.selectedCallIndex = index;
                self.fetchCallDetails(index)
            }
            else {
                $scope.selectedCallIndex = undefined;
                phoneService.callDetailsContact = undefined;
            }
        };

        self.missedCalls = [];
        self.outgoingCalls = [];
        self.incomingCalls = [];

        function filterCalls(calls){
          calls.forEach(function(call){
            if(!call.answered){
              self.missedCalls.push(call);
            }
          });

          calls.forEach(function(call){
            if(call.incoming && call.answered){
              self.incomingCalls.push(call);
            }
          });

          calls.forEach(function(call){
            if(!call.incoming && call.answered){
              self.outgoingCalls.push(call);
            }
          });
          phoneService.missedCalls = angular.copy(self.missedCalls);
          phoneService.incomingCalls = angular.copy(self.incomingCalls);
          phoneService.outgoingCalls = angular.copy(self.outgoingCalls);

          //clear fetched calls
          self.missedCalls = [];
          self.incomingCalls = [];
          self.outgoingCalls = [];
        }

        function filterSidebarCalls(){
            self.sidebarMissedCalls = [];
            self.sidebarIncomingCalls = [];
            self.sidebarOutgoingCalls = [];
            self.phoneService.phone.recentCallList.forEach(function(call, index) {
                call.realIndex = index;
                if(!call.answered){
                    self.sidebarMissedCalls.push(call);
                }
                else if(call.incoming){
                    self.sidebarIncomingCalls.push(call);
                }
                else{
                    self.sidebarOutgoingCalls.push(call);
                }
            });
            phoneService.sidebarMissedCalls = angular.copy(self.sidebarMissedCalls);
            phoneService.sidebarIncomingCalls = angular.copy(self.sidebarIncomingCalls);
            phoneService.sidebarOutgoingCalls = angular.copy(self.sidebarOutgoingCalls);

            $rootScope.sidebarMissedCalls = phoneService.sidebarMissedCalls;
            $rootScope.sidebarIncomingCalls = phoneService.sidebarIncomingCalls;
            $rootScope.sidebarOutgoingCalls = phoneService.sidebarOutgoingCalls;

            self.sidebarMissedCalls = [];
            self.sidebarIncomingCalls = [];
            self.sidebarOutgoingCalls = [];

        };

        self.fetchCallDetails = function(index){
          phoneService.selectedCallDetailsIndex = index;
          console.log(phoneService.selectedCallDetailsIndex);
          var selectedCall = self.phoneService.phone.recentCallList[index];
          var myPhoneNumber = self.phoneService.activeAccount.phone;
          var otherUserPhoneNumber;
          if(selectedCall.from != myPhoneNumber){
            otherUserPhoneNumber = selectedCall.from;
          }
          else{
            otherUserPhoneNumber = selectedCall.to;
          }

          self.allCalls = [];
          self.phoneService.phone.recentCallList.map(function(call, index){
            if(otherUserPhoneNumber === call.from || otherUserPhoneNumber === call.to){
                self.allCalls.push(call);
            }
          })
          phoneService.callDetailsCalls = angular.copy(self.allCalls);
          var contactList = self.phoneService.activeAccount.contactManager.contactList;
          var contact =
          {
            "firstName" : "Unknown",
            "phone" : otherUserPhoneNumber,
            "picture" : "../../images/default_contact_avatar.png"
          };
          contactList.map(function(mercurioContact){
            if(mercurioContact.phone == otherUserPhoneNumber || mercurioContact.extension == otherUserPhoneNumber){
              contact = angular.copy(mercurioContact);
            }
          });
          phoneService.callDetailsContact = contact;
          //Set default contact
          contact=
          {
            "firstName" : "Unknown",
            "phone" : otherUserPhoneNumber,
            "picture" : "../../images/default_contact_avatar.png"
          };
          filterCalls(phoneService.callDetailsCalls);
        }

        self.showDeleteConfirm = function(event, index) {
            if (index == null) {
                var callIndex = phoneService.selectedCallDetailsIndex;
            } else {
                var callIndex = index;
            }
            // var callIndex = phoneService.selectedCallDetailsIndex.recentCallList;
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title('Are you sure you want to delete this call from your recents list?')
                .ariaLabel('delete confirm')
                .targetEvent(event)
                .ok('Delete')
                .cancel('Cancel');

            $mdDialog.show(confirm).then(function() {
                //$scope.status = 'You decided to get rid of your debt.';
                var recentCallsLength = phoneService.phone.recentCallList.length;
                phoneService.phone.deleteCalls([callIndex]);
                var interval = setInterval(function(){
                    if(recentCallsLength != phoneService.phone.recentCallList.length){
                        filterSidebarCalls(phoneService.phone.recentCallList);
                        console.log('im here');
                        clearInterval(interval);
                        $rootScope.$apply();
                    }
                }, 500);

                //$state.go('dialer');
            }, function() {
                //$scope.status = 'You decided to keep your debt.';
            });
        };

        self.call = function(){
          phoneService.phone.addNewCall(false, self.phoneService.callDetailsContact.phone, self.phoneService.activeAccount.phone, false, new Date().getTime());
					$state.go('call', {'callIndex' : 0});
        }

        self.redial = function(phoneNumber){
            phoneService.phone.addNewCall(false, phoneNumber, self.phoneService.activeAccount.phone, false, new Date().getTime());
            $state.go('call', {'callIndex' : 0});
        };


    }]);
})();
