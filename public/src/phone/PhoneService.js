/**
 * Created by brianlandron on 10/6/16.
 */
(function(){

    'use strict';

    angular.module('mercurio').service('phoneService', function(){

        var self = this;
        self.phone;

        self.instantiatePhone = function(userId){
            self.phone = new MercurioPhone({
                ws_servers: 'ws://mercurio-gateway-813906161.us-west-1.elb.amazonaws.com:8080',
                uri: '7873042981@63.131.240.90',
                password: 'jENnJzYMHBqGE9o'
            }, userId);
        }
    });

})();