/**
 * Created by brianlandron on 10/6/16.
 */
/**
 * Created by brianlandron on 9/14/16.
 */
(function(){

    'use strict';

    angular.module('mercurio').service('crmService', ['$stateParams', '$location', '$anchorScroll', function($stateParams, $location, $anchorScroll){

        var self = this;
        self.crmManager = null;
        self.selectedNumber = null;
        self.callableRecords = null;

        self.instantiateCRMManager = function(userId){
            self.crmManager = new MercurioCRMManager(userId);
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