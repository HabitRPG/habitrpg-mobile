'use strict';

habitrpg.controller('GuildCtrl',
  ['$rootScope','$scope', 'User', '$resource', 'API_URL', '$state', '$http', 'Groups',
    function($rootScope, $scope, User, $resource, API_URL, $state, $http, Groups) {

      $scope.guilds = [];

      var startSyncing = function(){
        $rootScope.syncing = true;
      }
      var doneSyncing = function(){
        $rootScope.syncing = false;
      }

      $scope.syncGuilds = function() {
        startSyncing();
        Groups.myGuilds().$promise.then(function(guilds) {
          $scope.guilds = guilds;
          doneSyncing();
        });
      };

      $scope.viewGuild = function(guild, e) {
        $state.go('app.chat.guild', {gid:guild._id});
      }
    }
  ]);
