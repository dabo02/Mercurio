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
    self.background = "images/background.jpg";
    self.recentsView = true;
    self.chatsView = false;
    self.statusMessage = "Tol Tol";
    self.displayName = "Ralo";
    self.profileImage = "images/contact0Dressed.jpg";

    document.getElementById('displayName').value = self.displayName;
    document.getElementById('statusMessage').value = self.statusMessage;

     $scope.showDialer = function(){
                self.editProfileStatus = false;
                self.contactsStatus = false;
                self.dialerStatus = true;
             }

             $scope.showContacts = function(){
                self.editProfileStatus = false;
                self.dialerStatus = false;
                self.contactsStatus = true;
             }

             $scope.showEditProfile = function(){
                self.dialerStatus = false;
                self.contactsStatus = false;
                self.editProfileStatus = true;
             }

     var contacts = [
        {
        name: "Alberto Nieves",
        image: "images/contact0Dressed.jpg",
        status: "",
        phone: "787-518-1788",
        address: "Comerio",
        ringtone: "medieval",
        notes: "tol tol",
        facebook: "",
        twitter: "",
        linkedin: "",
        crm: ""
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
        name: "Israel Figueroa",
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
        }];

        $scope.displayContacts = function(){
            console.log("CDisplaying...");
            $scope.showContacts();


            var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
            var tempContacts = [];
            setTimeout(function() {
                             for (var j = 0; j < alphabet.length; j++) {
                                  console.log(alphabet[j]);
                                  tempContacts = [];
                                  for (var i = 0; i < contacts.length; i++) {
                                      if(contacts[i].name.substring(0,1) == alphabet[j]){
                                         tempContacts.push(contacts[i]);
                                         console.log("Con la letra " + alphabet[j] +" - " + contacts[i].name);
                                      }
                                  }
                                  if(tempContacts.length>0){
                                     document.getElementById("contacts-list").innerHTML = document.getElementById("contacts-list").innerHTML
                                     + '<a id=contact-initial href=""> <h2>' + tempContacts[0].name.substring(0,1) + '</h2> </a>';
                                     for(var i = 0; i < tempContacts.length; i++){
                                         document.getElementById("contacts-list").innerHTML = document.getElementById("contacts-list").innerHTML
                                         + '<md-content ng-click="showEditProfile()" id="contacts-content">'
                                         + '<md-button> <md-list id="contacts-card" flex>'
                                         + '<md-list-item class="row">'
                                         + '<div style="margin-left:5%;" class="col-lg-1 col-md-1">'
                                         + '<img style="width:50px; height:50px; border-radius:35px;" src="' + tempContacts[i].image + '"/> </div>'
                                         + '<div style="margin-left: 2%; margin-top: 2%;" class="col-lg-7 col-md-7"" layout="column">'
                                         + '<p style="font-size:20px; word-break: break-all" flex="50">' + tempContacts[i].name + '</p>'
                                         + '<p> Status </p> </div> <p class="col-lg-3 col-md-3 col-lg-push-1 col-md-push-1"> Mobile </p> </md-list-item>'
                                         + '</md-list> </md-button> </md-content>';
                                     }
                                  }
                             }
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
        self.displayName = document.getElementById("displayName").value;
        self.statusMessage = document.getElementById("statusMessage").value;
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
        console.log("cus");
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
        console.log(self.chatsView);
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
                    console.log("Bye");
                    }, function(error) {
                    // An error happened.
                    console.log(error);
                    });
          }


    }

  }

})();
