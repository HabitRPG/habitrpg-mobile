'use strict';

/**
 * The character controller:
 *
 */

habitrpg.controller('CharacterCtrl',
  ['$rootScope','$scope', '$location', 'User',
  function($rootScope, $scope, $location, User) {

        $scope.customize = false;

        $scope.floor = Math.floor;
        $scope.count = function(arr) {
            return _.size(arr);
        }

        $scope.showUserAvatar = function() {
            $('.userAvatar').show()
        }

  }
]);
