/**
 * Created by brianlandron on 9/19/16.
 */
(function(){
    'use strict';

    angular.module('mercurio').directive('profileEditorForm',function(){
        return {
            templateUrl:'src/account/profileEditorForm.html',
            restrict: 'E',
            replace: false
        }
    });
})();
