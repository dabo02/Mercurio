/**
 * Created by brianlandron on 10/6/16.
 */
(function(){

    'use strict';

    angular.module('mercurio').controller('ManageCRMController', ['crmService', '$mdDialog', '$scope', '$timeout', function(crmService, $mdDialog, $scope, $timeout){

        var self = this;

        self.saveCRMDetailsButtonIsAvailable = false;

        self.crmManager = crmService.crmManager;

        self.showManageCRMDialog = function(event) {

            $mdDialog.show({
                templateUrl: 'manageCRMForm',
                parent: angular.element(document.body),
                targetEvent: event,
                escapeToClose: true,
                clickOutsideToClose:true
                //fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            });
        }

        self.closeManageCRMDialog = function(){
            $mdDialog.hide()
        };

        self.addCRM = function(){

            if(self.token.length < 1){
                return;
            }

            if(self.name.length < 1){
                return;
            }

            var crmInfo = {
                insertCallsAutomatically: self.newInsertCallsAutomaticallySetting,
                name: self.name,
                token: self.token,
                type: 'zoho',
                validated: false
            };

            $scope.savingCRMInfo = true;

            crmService.crmManager.addCRM(crmInfo, function(){
                $timeout(function(){
                    $scope.$apply();
                });
            });

            self.saveCRMDetailsButtonIsAvailable = false;
        }

        self.getCRMName = function(){
            if(!crmService.isCRMListEmpty()){
                return crmService.crmManager.crmList[0].name;
            }
        }

        self.getCRMToken = function(){
            if(!crmService.isCRMListEmpty()){
                return crmService.crmManager.crmList[0].token;
            }
        }

        self.getCRMInsertCallsSetting = function(){
            if(!crmService.isCRMListEmpty()){
                return crmService.crmManager.crmList[0].insertCallsAutomatically;
            }
        }

        self.crmNameChanged = function(){
            self.saveCRMDetailsButtonIsAvailable = true;
        }

        self.crmTokenChanged = function(){
            self.saveCRMDetailsButtonIsAvailable = true;
        }

        self.insertCallsCheckboxChanged = function(){
            self.saveCRMDetailsButtonIsAvailable = true;
        }

        self.findCRMAuthTokenButtonClicked = function(){
            window.open("https://accounts.zoho.com/apiauthtoken/create?SCOPE=ZohoCRM/crmapi");
        }

        self.newInsertCallsAutomaticallySetting = self.getCRMInsertCallsSetting() || false;
        self.token = self.getCRMToken() || '';
        self.name = self.getCRMName() || '';

        if(crmService.crmManager.crmList.length > 0){
            $scope.crm = crmService.crmManager.crmList[0];
        }
        else {
            $scope.crm = null;
        }
    }])
})();
