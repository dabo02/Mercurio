/**
 * Created by brianlandron on 10/6/16.
 */
(function(){

    'use strict';

    angular.module('mercurio').controller('AddCallToCRMController', ['phoneService', 'crmService', '$mdDialog', '$scope', function(phoneService, crmService, $mdDialog, $scope){

        var self = this;
        self.crmService = crmService;
        self.phoneService = phoneService;

        self.addCallToCRMButtonClicked = function(call, event){
          if(call.from === phoneService.activeAccount.phone){
              self.selectedNumber = call.to;
              self.selectedCallDirection = 'Outgoing';
          }
          else{
              self.selectedNumber = call.from;
              self.selectedCallDirection = 'Incoming';
          }
          crmService.addCallToCRM(self.selectedNumber, self.selectedCallDirection, event);
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
