/**
 * Created by brianlandron on 10/6/16.
 */
/**
 * Created by brianlandron on 9/14/16.
 */
(function(){

    'use strict';

    angular.module('mercurio').service('crmService', ['$stateParams', '$rootScope', '$mdDialog', '$location', '$anchorScroll', function($stateParams, $rootScope, $mdDialog, $location, $anchorScroll){

        var self = this;
        self.crmManager = null;
        self.selectedNumber = null;
        self.callableRecords = null;
        self.isFetching = false;

        self.instantiateCRMManager = function(userId){
            self.crmManager = new MercurioCRMManager(userId);
          }

        //this one chows the add cal to crm dialog and fetches callable records
        self.addCallToCRM = function(phone, type, event, insertCallsAutomatically){
          if(insertCallsAutomatically || insertCallsAutomatically==null){
            self.isFetching=true;
            self.showAddCallToCRMDialog(event);
            self.callableRecords = null;
            /*
            if(call.from !== accountService.activeAccount.phone){
                crmService.selectedNumber = call.from;
                crmService.selectedCallDirection = 'Missed';

                if(call.answered){
                    crmService.selectedCallDirection = 'Incoming';
                }
            }
            else{
                crmService.selectedNumber = call.to;
                crmService.selectedCallDirection = 'Outgoing';
            }
            */

            self.crmManager.crmList[0].searchCallableRecords(phone, function(records){
                self.callableRecords = records;
                  $rootScope.$apply(function(){
                        self.isFetching = false;
                    });
            });
          }
        }

        self.showAddCallToCRMDialog = function(event) {
            $mdDialog.show({
                //controller: AddCallToCRMController,
                templateUrl: 'addCallToCRMForm',
                parent: angular.element(document.body),
                targetEvent: event,
                escapeToClose: true,
                clickOutsideToClose:true
                //fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            });
        }

        self.closeAddCallToCRMDialog = function(){
            $mdDialog.hide()
        }

        self.isCRMListEmpty = function(){
            if(self.crmManager !== null) {
                return self.crmManager.crmList.length === 0 ? true : false;
            }
            else{
                return true;
            }
        }

    }]);

})();
