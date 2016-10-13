/**
 * Created by brianlandron on 10/4/16.
 */
(function(){

    'use strict';

    angular.module('mercurio').directive('recentCallList',function(){
        return {
            templateUrl:'src/phone/recentCallList.html',
            restrict: 'E',
            replace: false
        }
    });
})();