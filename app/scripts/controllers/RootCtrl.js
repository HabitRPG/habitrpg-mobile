'use strict';
// Make user and settings available for everyone through root scope.
habitrpg.controller('RootCtrl', function ($scope, $rootScope, $location, User) {

  $rootScope.User = User;
  $rootScope.user = User.user;
  $rootScope.settings = User.settings;

  // FIXME this is dangerous, organize helpers.coffee better, so we can group them by which controller needs them,
  // and then simply _.defaults($scope, Helpers.user) kinda thing
  _.defaults($rootScope, habitrpgShared.helpers);

  /**
   * Show title according to the location
   */
  $rootScope.taskTypeTitle = function () {
    switch ($location.path().split('/')[1]) {
      case 'habit':
        return 'Habits';
      case 'daily':
        return 'Dailies';
      case 'todo':
        return 'Todos';
      case 'reward':
        return 'Rewards';
      default :
        return "";
    }
  };

});
