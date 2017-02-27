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
        self.callInserted = false;

        self.instantiateCRMManager = function(userId){
            self.crmManager = new MercurioCRMManager(userId);
          }

        //this one s
        // hows the add cal to crm dialog and fetches callable records
        self.fetchCallableRecords = function(phone){//}, type, event, insertCallsAutomatically){

            //if(phone.length >= 10){
                self.isFetching=true;
                //self.showAddCallToCRMDialog(event);
                self.callableRecords = null;

                self.crmManager.crmList[0].searchCallableRecords(phone, function(records){
                    self.callableRecords = records;
                    $rootScope.$apply(function(){
                        self.isFetching = false;
                    });
                });
            //}
        }

        self.getPhoneNumberToLog = function(call, myPhone){
            var selectedNumber;
            if(call.from === myPhone){
                selectedNumber = call.to;
                self.selectedCallDirection = 'Outgoing';
            }
            else{
                selectedNumber = call.from;
                self.selectedCallDirection = 'Incoming';
            }

            return selectedNumber;
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
