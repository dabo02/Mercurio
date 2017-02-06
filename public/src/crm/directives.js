/**
 * Created by brianlandron on 10/6/16.
 */
(function(){

    'use strict';

    angular.module('mercurio')

        .directive('addCallToCrmForm',function(){
            return {
                templateUrl:'src/crm/addCallToCRMForm.html',
                restrict: 'E',
                replace: false
            }
        })

        .directive('manageCrmForm',function(){
            return {
                templateUrl:'src/crm/manageCRMForm.html',
                restrict: 'E',
                replace: false
            }
        });
})();