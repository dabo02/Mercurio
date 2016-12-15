/**
 * Created by brianlandron on 10/6/16.
 */
(function(){

    'use strict';

    angular.module('mercurio').controller('AddCallToCRMController', ['accountService', 'crmService', '$mdDialog', '$scope', function(accountService, crmService, $mdDialog, $scope){

        var self = this;
        self.crmService = crmService;

        self.markCallAsSelected = function(event, call){
            self.showFetchingCallableRecordsProgress();
            crmService.callableRecords = null;

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

            if(call.from === accountService.activeAccount.phone){
                crmService.selectedNumber = call.to;
                crmService.selectedCallDirection = 'Outgoing';
            }
            else{
                crmService.selectedNumber = call.from;
                crmService.selectedCallDirection = 'Incoming';
            }

            crmService.crmManager.crmList[0].searchCallableRecords(crmService.selectedNumber, function(records){
                crmService.callableRecords = records;
                if(self.isCallableRecordListAvailable()) {
                    $mdDialog.hide();
                    self.showAddCallToCRMDialog(event);
                }
            });
        }


        self.isCallableRecordListAvailable = function(){
            return (crmService.callableRecords !== null) &&
                (crmService.callableRecords['Leads'].length > 0 ||
                crmService.callableRecords['Contacts'].length > 0 ||
                crmService.callableRecords['Accounts'].length > 0);
        }

        self.isCallableLeadListAvailable = function(){
            return crmService.callableRecords['Leads'].length > 0;
        }

        self.isCallableContactListAvailable = function(){
            return crmService.callableRecords['Contacts'].length > 0;
        }

        self.isCallableAccountListAvailable = function(){
            return crmService.callableRecords['Accounts'].length > 0;
        }

        self.showFetchingCallableRecordsProgress = function(){
            $mdDialog.show({
                //controller: AddCallToCRMController,
                templateUrl: 'fetchingCallableRecordsProgress',
                parent: angular.element(document.body),
                targetEvent: event,
                escapeToClose: true,
                clickOutsideToClose:true
                //fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            })
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

        self.addCallToCRM = function(){

            var info = {};

            var callFromTo;

            self.selectedRecords.forEach(function(record){

                if(record.leadId){
                    callFromTo = 'Lead';
                }
                else if(record.contactId){
                    callFromTo = 'Contact';
                }
                else if(record.accountId){
                    callFromTo = 'Account';
                }
                else{
                    callFromTo = '';
                }

                info = {
                    smOwnerId: record.smOwnerId.toString(),
                    subject: self.notes,
                    callType: crmService.selectedCallDirection,
                    callPurpose: 'Demo',
                    callFromTo: callFromTo,
                    id: (record.leadId || record.contactId || record.accountId).toString(),
                    module: callFromTo + 's',
                    startTime: '2011-06-10 22:10:00',
                    duration: '60:00',
                    description: "This is just a test",
                    billable: false,
                    result: 'Successful'
                };


                console.log("\n\nCall to insert info:\n\n" + info);
                crmService.crmManager.crmList[0].addCall(info, function(call){
                    console.log(call);
                });
            });

            //$mdDialog.hide();
        }

        self.closeAddCallToCRMDialog = function(){
            $mdDialog.hide()
        }
    }])
})();