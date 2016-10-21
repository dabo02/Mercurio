angular.module('users')
.controller('ContactListController', ['$scope', 'accountService', '$q', '$timeout', '$state', function ($scope, accountService, $q, $timeout, $state) {

    var self = this;
    self.alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    self.tempContacts = [];

    var contacts = accountService.activeAccount.contactManager.contactList;
    self.contactList = accountService.activeAccount.contactManager.contactList;
    self.accountService = accountService;

    var pendingSearch, cancelSearch = angular.noop;
    var cachedQuery, lastSearch;
    self.allContacts = loadContacts();
    self.contacts = [self.allContacts[0]];
    self.asyncContacts = [];
    self.filterSelected = true;
    self.querySearch = querySearch;
    self.delayedQuerySearch = delayedQuerySearch;

    $scope.getChipInfo= function(chip_info) {
        console.log(chip_info);
    }

    /**
     * Search for contacts; use a random delay to simulate a remote call
     */
    function querySearch (criteria) {
        cachedQuery = cachedQuery || criteria;
        var answer = cachedQuery ? self.allContacts.filter(createFilterFor(cachedQuery)) : [];;
        return answer;
    }
    /**
     * Async search for contacts
     * Also debounce the queries; since the md-contact-chips does not support this
     */
    function delayedQuerySearch(criteria) {
        cachedQuery = criteria;
        if ( !pendingSearch || !debounceSearch() )  {
            cancelSearch();
            return pendingSearch = $q(function(resolve, reject) {
                // Simulate async search... (after debouncing)
                cancelSearch = reject;
                $timeout(function() {
                    resolve( self.querySearch() );
                    refreshDebounce();
                }, Math.random() * 500, true)
            });
        }
        return pendingSearch;
    }
    function refreshDebounce() {
        lastSearch = 0;
        pendingSearch = null;
        cancelSearch = angular.noop;
    }
    /**
     * Debounce if querying faster than 300ms
     */
    function debounceSearch() {
        var now = new Date().getMilliseconds();
        lastSearch = lastSearch || now;
        return ((now - lastSearch) < 300);
    }
    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(contact) {
            return (contact._lowername.indexOf(lowercaseQuery) != -1);;
        };
    }
    function loadContacts() {
        console.log('load contacts called');
        contacts.forEach(function(contact){
            contact.name = contact.firstName + " " + contact.lastName;
            contact._lowername = contact.name.toLowerCase();
        })
        return contacts;
    }

    $scope.items = self.userCallHistory;
    $scope.selected = [ ];

    $scope.toggle = function (item, list) {
        var idx = list.indexOf(item);
        if (idx > -1) {
            list.splice(idx, 1);
        }
        else {
            list.push(item);
        }
    };
    $scope.exists = function (item, list) {
        return list.indexOf(item) > -1;
    };
    $scope.isIndeterminate = function() {
        return ($scope.selected.length !== 0 &&
        $scope.selected.length !== $scope.items.length);
    };
    $scope.isChecked = function() {
        return $scope.selected.length === $scope.items.length;
    };
    $scope.toggleAll = function() {
        if ($scope.selected.length === $scope.items.length) {
            $scope.selected = [];
        } else if ($scope.selected.length === 0 || $scope.selected.length > 0) {
            $scope.selected = $scope.items.slice(0);
        }
    };
    $scope.areItemsSelected = function(){
        return $scope.selected.length > 0
    };

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

    self.viewContact = function(contactIndex){
        console.log('view contact clicked: contact index = ' + contactIndex);
        $state.go('contact-profile', {'contactIndex' : contactIndex});
    }

    self.getContactByNumber = function(number){
        contacts.forEach(function(contact){
            if(contact.phone == number){
                return contact;
            }
        })
    };

}]);