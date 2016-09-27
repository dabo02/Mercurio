angular.module('users')
.controller('ContactListController', ['$scope', 'accountService', function($scope, accountService) {

    var self = this;
    self.alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    self.tempContacts = [];


    var contacts = accountService.activeAccount.contactManager.contactList;

    /*[
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
    ];*/

    self.isContactListAvailable = function(){
        return accountService.isContactListAvailable();
    }

    self.setContacts = function(letter){
        self.tempContacts = [];
        for(var i = 0; i < contacts.length ; i++){
            if(contacts[i].firstName.substring(0,1) == letter || contacts[i].firstName.substring(0,1) == letter.toLowerCase()){
                self.tempContacts.push(contacts[i]);
            }
        }
        if (self.tempContacts.length > 0){
            return true;
        }
        else{
            return false;
        }
    }

    $scope.selectedContact;

    $scope.showContact = function(contact){
        $scope.selectedContact = contact;
        location.replace("#/contact-profile");
    }
}]);