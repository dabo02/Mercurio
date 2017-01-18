/**
 * Created by brianlandron on 9/14/16.
 */
(function(){

    'use_strict';

    angular.module('mercurio', ['ngMaterial', 'users', 'oc.lazyLoad', 'ui.router', 'luegg.directives', 'firebase'])
        .config(function($mdThemingProvider, $mdIconProvider){

            $mdIconProvider
                .defaultIconSet("./assets/svg/avatars.svg", 128)
                .icon("menu"       , "./assets/svg/menu.svg"        , 24)
                .icon("share"      , "./assets/svg/share.svg"       , 24)
                .icon("google_plus", "./assets/svg/google_plus.svg" , 512)
                .icon("hangouts"   , "./assets/svg/hangouts.svg"    , 512)
                .icon("twitter"    , "./assets/svg/twitter.svg"     , 512)
                .icon("phone"      , "./assets/svg/phone.svg"       , 512);

            $mdThemingProvider.theme('default')
                .primaryPalette('blue')
                .accentPalette('red');

        }).factory("Auth", ["$firebaseAuth",
            function($firebaseAuth) {
                var ref = new firebase.database().ref();
                return $firebaseAuth(ref);
            }
        ]).config(['$stateProvider','$urlRouterProvider','$ocLazyLoadProvider',function ($stateProvider,$urlRouterProvider,$ocLazyLoadProvider) {

            $ocLazyLoadProvider.config({
                debug: false,
                events: true
            });

            $urlRouterProvider.otherwise('/dialer');

            $stateProvider
                .state('dialer', {
                    url: '/dialer',
                    templateUrl: '/src/phone/dialer.html',
                    authenticate: true
                    //resolve: {
                    //    auth: function resolveAuthentication(AuthResolver) {
                    //        return AuthResolver.resolve();
                    //    }
                    //}
                })
                .state('call', {
                    url: '/call/:callIndex',
                    templateUrl: '/src/phone/call.html',
                    authenticate: true
                })
                .state('contacts', {
                    url: '/contacts',
                    templateUrl: '/src/contacts/contacts.html',
                    authenticate: true
                })
                .state('contact-profile', {
                    url: '/contact-profile/:contactIndex',
                    templateUrl: '/src/contacts/contactProfile.html',
                    authenticate: true
                })
                .state('edit-profile', {
                    url: '/edit-profile',
                    templateUrl: '/src/contacts/editProfile.html',
                    authenticate: true
                })
                .state('chat', {
                    url: '/chat/:chatIndex/:chatClientOwner',
                    templateUrl: '/src/chats/chat.html',
                    authenticate: true
                })
                .state('crm-manager', {
                    url: '/crm-manager',
                    templateUrl: '/src/crm/crmList.html',
                    authenticate: true
                })
                .state('login', {
                    url: '/login',
                    templateUrl: '/src/account/loginForm.html'
                });
        }])

        .factory('AuthResolver', function ($q, $rootScope, $state) {
            return {
                resolve: function () {
                    var deferred = $q.defer();
                    var unwatch = $rootScope.$watch('currentUser', function (currentUser) {
                        if (angular.isDefined(currentUser)) {
                            if (currentUser) {
                                deferred.resolve(true);
                            } else {
                                deferred.reject(true);
                                //$state.go('login');
                            }
                            unwatch();
                        }
                    });
                    return deferred.promise;
                }
            };
        })

        .run(['$rootScope', '$state', '$location', 'accountService', '$timeout', 'AuthResolver', function($rootScope, $state, $location, accountService, $timeout, AuthResolver){
            $rootScope.spinnerActivated = true;
            //$timeout(function() {
                $rootScope.spinnerActivated = false;
                $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
                    if(AuthResolver.resolve()){
                        if(toState.authenticate && !accountService.isAccountAvailable()){
                            $state.transitionTo("login");
                            event.preventDefault();
                        }
                    }
                    //if (toState.name != 'login' && !accountService.isAccountAvailable()){
                    //    $location.url('/login');
                    //    //$state.go('login');
                    //}
                });
            //}, 4000);
        }]);


}());