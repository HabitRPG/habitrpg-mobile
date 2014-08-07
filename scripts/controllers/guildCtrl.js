'use strict';

habitrpg.controller('GuildCtrl',
  ['$rootScope','$scope', 'User', '$resource', 'API_URL', '$state', '$http', 'Groups',
    function($rootScope, $scope, User, $resource, API_URL, $state, $http, Groups) {

      $scope.guilds = [];


      $scope.syncGuilds = function() {
        Groups.myGuilds().$promise.then(function(guilds) {
          $scope.guilds = guilds;
        });
      };

      $scope.syncGuilds();

      $scope.viewGuild = function(guild, e) {
        $state.go('app.chat.guild', {gid:guild._id});
      }
    }
  ]);
