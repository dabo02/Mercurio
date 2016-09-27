/**
 * Created by brianlandron on 9/14/16.
 */
(function(){

    'use_strict';

    angular.module('mercurio', ['ngMaterial', 'users', 'oc.lazyLoad', 'ui.router'])
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

        }).config(['$stateProvider','$urlRouterProvider','$ocLazyLoadProvider',function ($stateProvider,$urlRouterProvider,$ocLazyLoadProvider) {

            $ocLazyLoadProvider.config({
                debug: false,
                events: true
            });

            $urlRouterProvider.otherwise('/dialer');

            $stateProvider
                .state('dialer', {
                    url: '/dialer',
                    templateUrl: '/src/dialer/dialer.html'
                })
                .state('contacts', {
                    url: '/contacts',
                    templateUrl: '/src/contacts/contacts.html'
                })
                .state('contact-profile', {
                    url: '/contact-profile',
                    templateUrl: '/src/contacts/contactProfile.html'
                })
                .state('edit-profile', {
                    url: '/edit-profile',
                    templateUrl: '/src/contacts/editProfile.html'
                })
                .state('chat', {
                    url: '/chat/:chatIndex/:chatClientOwner',
                    templateUrl: '/src/chats/chat.html'
                })
                .state('login', {
                    url: '/login',
                    templateUrl: '/src/login/loginForm.html'
                });
        }]).run(function($rootScope, $state, $location, accountService){
             $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
                 if (toState.name !== 'login' && !accountService.isAccountAvailable()){
                     $location.url('/login');
                     //$state.go('login');
                 }
             });
        });


}());