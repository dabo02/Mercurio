/**
 * Created by brianlandron on 9/14/16.
 */
(function(){

    'use strict';

    angular.module('mercurio').factory('authenticationService', function(){

        return new MercurioAuthenticator();
    });

})();

