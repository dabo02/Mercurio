var app = angular.module("users")
  .config(function ($locationProvider, $httpProvider) {
/*
    $routeProvider.when('/edit',
    {
      templateUrl:    'src/calls/edit.html',
      controller:     'EditCtrl'
    });
    $routeProvider.when('/all',
    {
      templateUrl:    'src/calls/all.html',
      controller:     'AllCtrl'
    });
    $routeProvider.when('/missed',
    {
      templateUrl:    'src/calls/missed.html',
      controller:     'MissedCtrl'
    });
    $routeProvider.when('/chats',
        {
          templateUrl:    'src/chat/chats.html',
          controller:     'ChatCtrl'
        });
    $routeProvider.otherwise(
    {
      redirectTo:     '/all',
      controller:     'AllCtrl',
    }
  );*/
});

app.controller('NavCtrl',
['$scope', '$location', function ($scope, $location) {

  if($location.path().length>3){
    $scope.currentNavItem = $location.path();
  }
  $scope.navClass = function (page) {
    var currentRoute = $location.path().substring(1) || 'all';
    return page === currentRoute ? 'active' : '';
  };
}]);

app.controller('AllCtrl', function($scope, $compile) {

});

app.controller('EditCtrl', function($scope, $compile) {

});

app.controller('MissedCtrl', function($scope, $compile) {

});

app.controller('RecentCtrl', function($scope, $compile) {

});

app.controller('ChatsController', function($scope, $compile) {

  this.desktopNotifications=true
  this.desktopNotificationIcon="fa fa-bell-slash";
  this.desktopNotificationHeader="Get Notified of Incoming Messages";
  this.desktopNotificationParagraph="Enable Desktop Notifications";
  this.toggleNotifications = function(){
    if(this.desktopNotificationIcon == "fa fa-bell-slash"){
        this.desktopNotificationIcon="fa fa-bell";
        this.desktopNotificationHeader="Do not want Message Notifications?";
        this.desktopNotificationParagraph="Disable Desktop Notifications";
        enableNotifications();
    }
    else{
        this.desktopNotificationIcon="fa fa-bell-slash";
        this.desktopNotificationHeader="Get Notified of Incoming Messages";
        this.desktopNotificationParagraph="Enable Desktop Notifications";
        this.desktopNotifications=false
    }

  }

  function enableNotifications() {
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    }
    else{
        // Ask the user for permission
        Notification.requestPermission(function (permission) {
                // If the user accepts, let's create a notification
            if (permission === "granted") {
                  var options = {
                        body: "Notifications Activated",
                        icon: "images/mercury.png"
                    }
                  var notification = new Notification("Hi there!",options);
                  this.desktopNotifications=true
            }
        });

    }
  }

  function sendNotification(){
    if(this.desktopNotifications == true){
        //Notification Here
    }
  }

  this.conversations = [
             {
                   contact: 'Wilfredo Nieves',
                   lastMessage: 'Que tiene que ver eso con la navidad?',
                   contactImage: 'images/contact3.jpg',
                   lastMessageTime: '8:00 AM'
             },
             {
                   contact: 'Luis Prados',
                   lastMessage: ':)',
                   contactImage: 'images/contact5.jpg',
                   lastMessageTime: 'Yesterday'
             }];
});