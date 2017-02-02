(function(){

  angular
       .module('users')
       .controller('UserController', [
          'userService', '$mdSidenav', '$mdBottomSheet', '$timeout', '$log', '$scope','$mdDialog',
          UserController
       ]);
  /**
   * Main Controller for the Angular Material Starter App
   * @param $scope
   * @param $mdSidenav
   * @param avatarsService
   * @constructor
   */
  function UserController( userService, $mdSidenav, $mdBottomSheet, $timeout, $log, $scope, $mdDialog ) {
    var self = this;
    self.callStatus = false;
    self.dialerStatus = true;
    self.chatStatus = false;
    self.contactsStatus = false;
    self.editProfileStatus = false;
    self.alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

    self.background = "images/background.jpg";
    self.recentsView = true;
    self.chatsView = false;
    self.statusMessage = "Tol Tol";
    self.displayName = "Ralo";
    self.profileImage = "images/contact0Dressed.jpg";

    //document.getElementById('displayName').value = self.displayName;
    //document.getElementById('statusMessage').value = self.statusMessage;



    $scope.showContacts = function(){
        self.callStatus = false;
        self.chatStatus = false;
        self.dialerStatus = false;
        self.editProfileStatus = false;
        self.contactsStatus = true;

    }

    $scope.showEditProfile = function(){
        self.dialerStatus = false;
        self.contactsStatus = false;
        self.editProfileStatus = true;
    }

    var contacts = [
        {
        name: "Israel Figueroa",
        email: "israel.figueroa1@upr.edu",
        image: "images/contact0Dressed.jpg",
        phone: "787-518-1788",
        address: "Comerio",
        ringtone: "medieval",
        notes: "tol tol",
        facebook: "www.facebook.com/ralo",
        twitter: "www.twitter.com/ralo",
        linkedin: "www.linkedin.com/ralo",
        crm: "www.crm.com/ralo"
        },
        {
        name: "Brian Landron",
        image: "images/contact0Dressed.jpg"
        },
        {
        name: "Bruno Camacho",
        image: "images/contact0Dressed.jpg"
        },
        {
        name: "Darwin Martinez",
        image: "images/contact0Dressed.jpg"
        },
        {
        name: "Emilio Rodriguez",
        image: "images/contact0Dressed.jpg"
        },
        {
        name: "Esther Rivera",
        image: "images/contact0Dressed.jpg"
        },
        {
        name: "Alberto Nieves",
        image: "images/contact0Dressed.jpg"
        },
        {
        name: "Jovany Nieves",
        image: "images/contact0Dressed.jpg"
        },
        {
        name: "Luis Vega",
        image: "images/contact0Dressed.jpg"
        },
        {
        name: "Luis Prados",
        image: "images/contact0Dressed.jpg"
        },
        {
        name: "Luis 7",
        image: "images/contact0Dressed.jpg"
        },
        {
        name: "Luis el de cuca",
        image: "images/contact0Dressed.jpg"
        },
        {
        name: "Miguelito",
        image: "images/contact0Dressed.jpg"
        },
        {
        name: "Zuania Colon",
        image: "images/contact0Dressed.jpg"
        }
    ];

    $scope.selectedContact;

    $scope.showContact = function(contact){
        $scope.selectedContact = contact;
        location.replace("#/contact-profile");
    }

    $scope.tempContacts = [];

    $scope.setContacts = function(letter){
        $scope.tempContacts = [];
        for(var i = 0; i < contacts.length ; i++){
            if(contacts[i].name.substring(0,1) == letter){
                $scope.tempContacts.push(contacts[i]);
            }
        }
        if ($scope.tempContacts.length > 0){
            return true;
        }
        else{
            return false;
        }
    }

$scope.displayContacts = function(){
    location.replace("#/contacts");
}

//    $scope.displayContacts = function(){
//            var opts = {
//                          lines: 13 // The number of lines to draw
//                        , length: 28 // The length of each line
//                        , width: 14 // The line thickness
//                        , radius: 42 // The radius of the inner circle
//                        , scale: 1 // Scales overall size of the spinner
//                        , corners: 1 // Corner roundness (0..1)
//                        , color: '#1565c0' // #rgb or #rrggbb or array of colors
//                        , opacity: 0.25 // Opacity of the lines
//                        , rotate: 0 // The rotation offset
//                        , direction: 1 // 1: clockwise, -1: counterclockwise
//                        , speed: 1.4 // Rounds per second
//                        , trail: 54 // Afterglow percentage
//                        , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
//                        , zIndex: 2e9 // The z-index (defaults to 2000000000)
//                        , className: 'spinner' // The CSS class to assign to the spinner
//                        , top: '50%' // Top position relative to parent
//                        , left: '50%' // Left position relative to parent
//                        , shadow: false // Whether to render a shadow
//                        , hwaccel: false // Whether to use hardware acceleration
//                        , position: 'absolute' // Element positioning
//                        }
//                        var target = document.getElementById('main-content')
//                        var spinner = new Spinner(opts).spin(target);
//
//                    location.replace("#/contacts");
//
//                    function isNotRepeated(contact){
//                        if(document.getElementById("contacts-list").innerHTML.search(contact.name)>-1){
//                            return false;
//                        }
//                        return true;
//                    }
//
//                    setTimeout(function() {
//                        var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
//
//                                                     for (var j = 0; j < alphabet.length; j++) {
//
//                                                          tempContacts = [];
//                                                          for (var i = 0; i < contacts.length; i++) {
//                                                              if(contacts[i].name.substring(0,1) == alphabet[j]){
//                                                                 if(isNotRepeated(contacts[i])){
//                                                                    tempContacts.push(contacts[i]);
//                                                                 }
//                                                              }
//                                                          }
//                                                          if(tempContacts.length>0){
//                                                             document.getElementById("contacts-list").innerHTML = document.getElementById("contacts-list").innerHTML
//                                                             + '<a id=contact-initial> <h2>' + tempContacts[0].name.substring(0,1) + '</h2> </a>';
//                                                             for(var i = 0; i < tempContacts.length; i++){
//                                                                 document.getElementById("contacts-list").innerHTML = document.getElementById("contacts-list").innerHTML
//
//                                                                 + '<md-content id="contacts-content">'
//                                                                 + '<md-button> <md-list id="contacts-card" flex>'
//                                                                 + '<md-list-item class="row">'
//                                                                 + '<div style="margin-left:5%;" class="col-lg-1 col-md-1">'
//                                                                 + '<img style="width:50px; height:50px; border-radius:35px;" src="' + tempContacts[i].image + '"/> </div>'
//                                                                 + '<div style="margin-left: 2%; margin-top: 2%;" class="col-lg-7 col-md-7"" layout="column">'
//                                                                 + '<p style="font-size:20px; word-break: break-all" flex="50">' + tempContacts[i].name + '</p>'
//                                                                 + '<p>' + tempContacts[i].status + '</p> </div> <p class="col-lg-3 col-md-3 col-lg-push-1 col-md-push-1"> Mobile </p> </md-list-item>'
//                                                                 + '</md-list> </md-button> </md-content>';
//                                                             }
//                                                          }
//                                                     }
//                                    spinner.stop();
//                    }, 500);
//
//            //$scope.showContacts();
//
//
//
//    }

    $scope.$on('$routeChangeStart', function (scope, next, current) {
        if(next.templateUrl.search("contacts.html")!=-1){
            $scope.displayContacts();
        }
        if(next.templateUrl.search("contact-profile")!=-1){

        }
    });

    $scope.displayDialer = function(){
        self.callStatus = false;
        self.chatStatus = false;
        self.contactsStatus = false;
        self.editProfileStatus = false;
        setTimeout(function() {
            self.dialerStatus = true;
        }, 1);
    }

    $scope.saveDrawer = function (){

        var file = document.getElementById('drawerImage').files[0]; //sames as here

        if(file!=null){
            if(file.name.search("jpg")==-1){
                document.getElementById("backgroundFeedback").style.color = "red";
                document.getElementById("backgroundFeedback").value = "Image must be in .jpg format"
            }
            else{
                document.getElementById("backgroundFeedback").style.color = "green";
                document.getElementById("backgroundFeedback").value = file.name;
                self.background = window.URL.createObjectURL(file);
            }
        }
        var file = document.getElementById('profileImage').files[0]; //sames as here

            if(file!=null){
                if(file.name.search("jpg")==-1){
                            document.getElementById("profileFeedback").style.color = "red";
                            document.getElementById("profileFeedback").value = "Image must be in .jpg format"
                }
                else{
                            document.getElementById("profileFeedback").style.color = "green";
                            document.getElementById("profileFeedback").value = file.name;
                            self.profileImage = window.URL.createObjectURL(file);
                }
            }
        //self.displayName = document.getElementById("displayName").value;
        //self.statusMessage = document.getElementById("statusMessage").value;
    }

    $scope.customize = function(){
        $mdDialog.show({
            clickOutsideToClose: true,
            template:'<md-content style="padding:15%; width:400px; height:350px;" class="md-no-momentum"><md-input-container class="md-icon-float md-block">'
                     +'<!-- Use floating label instead of placeholder --><label>Display Name</label>'
                     +'<md-icon class="fa fa-user"></md-icon>'
                     +'<input type="text"></md-input-container>'
                     +'<md-input-container md-no-float class="md-block">'
                     +'<md-icon class="fa fa-comment-o"></md-icon>'
                     +'<input type="text" placeholder="Status Message">'
                     +'</md-input-container>'
                     +'<form id="form1" runat="server"><input type="file" id="imgInp" /></form>'
                     +'<button class="btn btn-danger">Cancel</button>'
                     +'<button ng-click=\"ul.setBackground()\" class="btn btn-info">Save</button></md-content>'
        }
//              $mdDialog.alert()
//                .clickOutsideToClose(true)
//                .title('Opening from offscreen')
//                .textContent('Closing to offscreen')
//                .ariaLabel('Offscreen Demo')
//                .ok('Amazing!')
//                // Or you can specify the rect to do the transition from
//                .openFrom({
//                  top: -50,
//                  width: 30,
//                  height: 80
//                })
//                .closeTo({
//                  left: 1500
//                })

        );

    }

    $scope.showView = function (view){
        if(view=="true"){
            self.recentsView = true;
            document.getElementById("recent-calls").style.color = "#ffc107";
            self.chatsView = false;
            document.getElementById("recent-chats").style.color = "white";
        }
        else{
            self.recentsView = false;
            document.getElementById("recent-calls").style.color = "white";
            self.chatsView = true;
            document.getElementById("recent-chats").style.color = "#ffc107";
        }
    }


    $scope.addNewContact = function (){
        var file = document.getElementById('drawerImage').files[0]; //sames as here

                if(file!=null){
                    if(file.name.search("jpg")==-1){
                        document.getElementById("pictureFeedback").style.color = "red";
                        document.getElementById("pictureFeedback").value = "Image must be in .jpg format"
                    }
                    else{
                        document.getElementById("pictureFeedback").style.color = "green";
                        document.getElementById("pictureFeedback").value = file.name;
                        $scope.newContact.image = window.URL.createObjectURL(file);
                    }
                }

        contacts.push($scope.newContact);
    }


    self.selected     = null;
    self.users        = [ ];
    self.selectUser   = selectUser;
    self.toggleList   = toggleUsersList;
    self.makeContact  = makeContact;

    // Load all registered users

    userService
          .loadAllUsers()
          .then( function( users ) {
            self.users    = [].concat(users);
            self.selected = users[0];
          });

    // *********************************
    // Internal methods
    // *********************************

    /**
     * Hide or Show the 'left' sideNav area
     */
    function toggleUsersList() {
      $mdSidenav('left').toggle();
    }

    /**
     * Select the current avatars
     * @param menuId
     */
    function selectUser ( user ) {
      self.selected = angular.isNumber(user) ? $scope.users[user] : user;
    }

    /**
     * Show the Contact view in the bottom sheet
     */
    function makeContact(selectedUser) {

        $mdBottomSheet.show({
          controllerAs  : "vm",
          templateUrl   : './src/users/view/contactSheet.html',
          controller    : [ '$mdBottomSheet', ContactSheetController],
          parent        : angular.element(document.getElementById('content'))
        }).then(function(clickedItem) {
          $log.debug( clickedItem.name + ' clicked!');
        });

        /**
         * User ContactSheet controller
         */
        function ContactSheetController( $mdBottomSheet ) {
          this.user = selectedUser;
          this.items = [
            { name: 'Phone'       , icon: 'phone'       , icon_url: 'assets/svg/phone.svg'},
            { name: 'Twitter'     , icon: 'twitter'     , icon_url: 'assets/svg/twitter.svg'},
            { name: 'Google+'     , icon: 'google_plus' , icon_url: 'assets/svg/google_plus.svg'},
            { name: 'Hangout'     , icon: 'hangouts'    , icon_url: 'assets/svg/hangouts.svg'}
          ];
          this.contactUser = function(action) {
            // The actually contact process has not been implemented...
            // so just hide the bottomSheet

            $mdBottomSheet.hide(action);
          };
        }

         $scope.signOut = function() {
            firebase.auth().signOut().then(function() {
                    // Sign-out successful.

                    }, function(error) {
                    // An error happened.
                    console.error(error);
                    });
          }


    }

  }

})();
