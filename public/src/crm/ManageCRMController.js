/**
 * Created by brianlandron on 10/6/16.
 */
(function(){

    'use strict';

    angular.module('mercurio').controller('ManageCRMController', ['crmService', function(crmService){

        var self = this;

        self.crmManager = crmService.crmManager;

        self.addCRM = function(){
            if(self.insertCalls === undefined){
                self.insertCalls = false;
            }
            var crmInfo = {
                insertCalls: self.insertCalls,
                name: self.name,
                token: self.token,
                type: 'zoho',
                validated: true
            };

            crmService.crmManager.addCRM(crmInfo);
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

        self.getCRMInsertCallsBool = function(){
            if(!crmService.isCRMListEmpty()){
                return crmService.crmManager.crmList[0].insertCalls;
            }
        }

    }])
})();