'use strict';

// Make user and settings available for everyone through root scope.
habitrpg.controller('RootCtrl',
  ['$scope', '$rootScope', '$location', 'User',
  function ($scope, $rootScope, $location, User) {

    $rootScope.User = User;
    $rootScope.user = User.user;
    $rootScope.set = User.set;
    $rootScope.settings = User.settings;
    $rootScope.Shared = window.habitrpgShared;

    $rootScope.authenticated = function() {
      return (User.settings.auth.apiId != '');
    }
  }
]);
