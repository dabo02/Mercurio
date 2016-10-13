/**
 * Created by brianlandron on 10/6/16.
 */
(function(){

    'use strict';

    angular.module('mercurio').controller('CRMListController', ['crmService', function(crmService){

        var self = this;

        self.crmManager = crmService.crmManager;

        self.isCRMListAvailable = function(){
            return true;
        }

        self.addCRM = function(){
            var crmInfo = {
                insertCalls: self.insertCalls,
                name: self.name,
                token: self.token,
                type: 'zoho',
                validated: true
            };

            self.crmManager.addCRM(crmInfo);
        }
    }])
})();