'use strict';

habitrpg.controller('GuildCtrl',
  ['$rootScope','$scope', 'User', '$resource', 'API_URL', '$state', '$http', 'Groups',
    function($rootScope, $scope, User, $resource, API_URL, $state, $http, Groups) {

      $scope.guilds = [];

      console.log('guild')

      $scope.syncGuilds = function() {
        Groups.myGuilds().$promise.then(function(guilds) {
          $scope.guilds = guilds;
        });
      };

      $scope.viewGuild = function(guild, e) {
        $state.go('app.guilds.guild', {gid:guild._id},
          {reload: true});
      }
      $scope.syncGuilds();
    }
  ]);
