(function () {
    'use strict';
    angular
        .module('users')
        .controller('ContactController', DemoCtrl);
    function DemoCtrl ($q, $timeout,$scope) {
      var self = this;
      var pendingSearch, cancelSearch = angular.noop;
      var cachedQuery, lastSearch;
      self.allContacts = loadContacts();
      self.contacts = [self.allContacts[0]];
      self.asyncContacts = [];
      self.filterSelected = true;
      self.querySearch = querySearch;
      self.delayedQuerySearch = delayedQuerySearch;
      self.userCallHistory = [
      {
           name: 'Wilfredo Nieves',
           time: '10:41 PM',
           call: 'received',
           image: 'images/contact3.jpg',
           type: 'fa fa-phone',
           icon:'images/in.png'
      },
      {
           name: 'Luis Prados',
           time: '6:43 AM',
           call: 'missed',
           image: 'images/contact5.jpg',
           type: 'fa fa-video-camera',
           icon:'images/miss.png'
      }];

      //Get missed calls from call history
      self.missedCallHistory = [ ];
      self.userCallHistory.forEach(function(entry) {
        if(entry.call =='missed'){
            self.missedCallHistory.push(entry);
        }
      });


      /**
       * Search for contacts; use a random delay to simulate a remote call
       */
      function querySearch (criteria) {
        cachedQuery = cachedQuery || criteria;
        return cachedQuery ? self.allContacts.filter(createFilterFor(cachedQuery)) : [];
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
        var contacts = [
          'Israel Figueroa',
          'Luis Vega',
          'Brian Landron',
          'Wilfredo Nieves',
          'Jose Luis',
          'Luis Prados',
          'Francisco Burgos',
          'Manuel Oran'
          ];

        return contacts.map(function (c, index) {
          var cParts = c.split(' ');
          var contact = {
            name: c
                      };
          contact._lowername = contact.name.toLowerCase();
          return contact;
        });
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

    }



  })();