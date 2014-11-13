'use strict';

habitrpg.controller('MountDetailsCtrl',
  ['$scope','User','$state', '$rootScope', 
    function($scope, User, $state, $rootScope) {
      var user = User.user;
      var params = $state.params.mount.split("+");

      $scope.mount = params[0];
      $scope.name = params[1]

      var pieces = $scope.mount.split('-');
      $scope.egg = pieces[0];
      $scope.potion = pieces[1];
      $scope.mountDisplayName = ($scope.name ? env.t($scope.name) : null) || env.t('mountName', {
        potion: $rootScope.Content.hatchingPotions[$scope.potion] ? $rootScope.Content.hatchingPotions[$scope.potion].text() : $scope.potion,
        mount: $rootScope.Content.eggs[$scope.egg] ? $rootScope.Content.eggs[$scope.egg].mountText() : $scope.egg
      });

      $scope.isAvatarMount = user.items.currentMount == $scope.mount;

      $rootScope.$watch('user.items.currentMount', function(after, before){
        if(after === before) return;

        $scope.isAvatarMount = after == $scope.mount;
      });

      $scope.chooseAvatarMount = function(){
        User.user.ops.equip({params:{type: 'mount', key: $scope.mount}});
      };
    }
  ]);
