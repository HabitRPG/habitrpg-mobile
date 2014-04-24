'use strict';

// Make user and settings available for everyone through root scope.
habitrpg.controller('RootCtrl',
  ['$scope', '$rootScope', '$location', 'User', '$state', '$stateParams', '$window',
  function ($scope, $rootScope, $location, User, $state, $stateParams, $window) {

    $rootScope.User = User;
    $rootScope.user = User.user;
    $rootScope.set = User.set;
    $rootScope.settings = User.settings;

    $rootScope.Shared = $window.habitrpgShared;
    $rootScope.moment = $window.moment;

    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    $rootScope.sync = function(){
      User.log({});
    }

    $rootScope.authenticated = function() {
      return (User.settings.auth.apiId != '');
    }
  }
]);
