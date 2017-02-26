angular.module('users')
.controller('ContactListController', ['$rootScope', '$scope', 'accountService', '$q', '$timeout', '$state', 'phoneService', '$mdDialog', function ($rootScope, $scope, accountService, $q, $timeout, $state, phoneService, $mdDialog) {

    var self = this;
    self.alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    self.tempContacts = [];

    var contacts = accountService.activeAccount.contactManager.contactList;
    self.contactList = accountService.activeAccount.contactManager.contactList;
    self.accountService = accountService;
    self.contactProfile = null;
    var pendingSearch, cancelSearch = angular.noop;
    var cachedQuery, lastSearch;
    self.allContacts = loadContacts();
    self.contacts = [self.allContacts[0]];
    self.sortedContacts = [];
    self.asyncContacts = [];
    self.filterSelected = true;
    self.querySearch = querySearch;
    self.delayedQuerySearch = delayedQuerySearch;

    self.selectedItem;
    self.searchText;
    self.noCache = false;
    self.selectedContact = accountService.selectedContact;

    $scope.getChipInfo= function(chip_info) {

    };

    self.delete = function(){
      self.asyncContacts = [];
    };
    /**
     * Search for contacts; use a random delay to simulate a remote call
     */
    function querySearch (criteria) {
        cachedQuery = criteria || cachedQuery;
        var decimalRegExp = /\d/;
	    var characterRegExp = /[a-zA-Z]*/;
        self.allContacts = loadContacts();
        if ((cachedQuery.includes("(") || cachedQuery.includes(")") || cachedQuery.includes("-") || decimalRegExp.test(cachedQuery)) && !characterRegExp.test(cachedQuery)){
            var answer = cachedQuery ? self.allContacts.filter(createFilterForPhone(cachedQuery)) : [];

        }else {
            var answer = cachedQuery ? self.allContacts.filter(createFilterFor(cachedQuery)) : [];
        }
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
        phoneService.contactSearchString = lowercaseQuery;
        return function filterFn(contact) {
            return (contact._lowername.indexOf(lowercaseQuery) != -1) || (contact.phone.indexOf(lowercaseQuery) != -1);;
        };
    }

    function createFilterForPhone(query) {
        return function filterFn(contact) {
            return (contact.phone.indexOf(query) != -1);;
        };
    }

    function loadContacts() {
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

    self.setContacts = function(letter, index){
        self.tempContacts = [];
        for(var i = 0; i < contacts.length ; i++){
            if(contacts[i].firstName.substring(0,1) == letter || contacts[i].firstName.substring(0,1) == letter.toLowerCase()){
                contacts[i].realIndex = i;
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

    self.showProfileEditorDialog = function(event) {

        $mdDialog.show({
            templateUrl: 'profileEditorForm',
            parent: angular.element(document.body),
            targetEvent: event,
            escapeToClose: true,
            clickOutsideToClose:true
            //fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        });
    }

    self.closeProfileEditorDialog = function(){
        $mdDialog.hide()
    };

    self.showProfileContactDialog = function(event) {

        $mdDialog.show({
            templateUrl: 'contactProfile',
            parent: angular.element(document.body),
            targetEvent: event,
            escapeToClose: true,
            clickOutsideToClose:true
            //fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        });
    }

    self.closeProfileContactDialog = function(){
        $mdDialog.hide()
    };



    self.viewContact = function(contact, event){
      accountService.selectedContact = contact;
      self.showProfileContactDialog(event);
    }

    self.getContactByNumber = function(number){
        contacts.forEach(function(contact){
            if(contact.phone == number){
                return contact;
            }
        })
    };

    self.searchTextChange = function(text){

    };

    self.selectedItemChange = function(contact){
        if(contact){
        self.viewContact(contact);
        self.searchText = '';
      }
    };

    self.viewContactById = function(id){
      if(id == accountService.activeAccount.userId){
        self.showProfileEditorDialog();
      }
      self.contactList.forEach(function (contact, index) {
          if (id == contact.userId) {
             self.viewContact(contact);
          }

    });
  };


  accountService.activeAccount.contactManager.setContactObserver(function(){
            $scope.$apply();
        })

}]);
