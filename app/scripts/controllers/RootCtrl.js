'use strict';
// Make user and settings available for everyone through root scope.
habitrpg.controller('RootCtrl', function ($scope, $rootScope, $location, User) {

  $rootScope.User = User;
  $rootScope.user = User.user;
  $rootScope.settings = User.settings;

  // FIXME this is dangerous, organize helpers.coffee better, so we can group them by which controller needs them,
  // and then simply _.defaults($scope, Helpers.user) kinda thing
  _.defaults($rootScope, habitrpgShared.helpers);

});
