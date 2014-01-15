'use strict';

habitrpg.controller('userAvatarCtrl',
  ['$scope', '$location', 'filterFilter', 'User',
  function($scope, $location, filterFilter, User) {

    $scope.unlock = function(path){
      var fullSet = ~path.indexOf(',');
      var cost = fullSet ? 1.25 : 0.5; // 5G per set, 2G per individual

      if (fullSet) {
        if (confirm("Purchase for 5 Gems?") !== true) return;
        if (User.user.balance < cost) return $rootScope.modals.buyGems = true;
      } else if (!User.user.fns.dotGet('purchased.' + path)) {
        if (confirm("Purchase for 2 Gems?") !== true) return;
        if (User.user.balance < cost) return $rootScope.modals.buyGems = true;
      }
      User.user.ops.unlock({query:{path:path}})
    }

  }
]);
