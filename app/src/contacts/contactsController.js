angular.module('users')
.controller('ContactsController', function($scope) {

    var contacts = [
    {
    name: "Alberto Nieves",
    image: "images/contact0Dressed.jpg"
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
        var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
        var tempContacts = [];
        document.getElementById("contacts-list").innerHTML = "";
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
                + '<a id=contact-initial href="#"> <h2>' + tempContacts[0].name.substring(0,1) + '</h2> </a>';
                for(var i = 0; i < tempContacts.length; i++){
                    document.getElementById("contacts-list").innerHTML = document.getElementById("contacts-list").innerHTML
                    + '<md-content id="contacts-content">'
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

    }
});