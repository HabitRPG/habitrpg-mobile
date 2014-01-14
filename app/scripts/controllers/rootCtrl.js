'use strict';

// Make user and settings available for everyone through root scope.
habitrpg.controller('RootCtrl',
  ['$scope', '$rootScope', '$location', 'User', '$state', '$stateParams',
  function ($scope, $rootScope, $location, User, $state, $stateParams) {

    $rootScope.User = User;
    $rootScope.user = User.user;
    $rootScope.set = User.set;
    $rootScope.settings = User.settings;
    $rootScope.Shared = window.habitrpgShared;

    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    $rootScope.authenticated = function() {
      return (User.settings.auth.apiId != '');
    }
  }
]);
