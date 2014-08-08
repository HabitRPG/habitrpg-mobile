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

habitrpg.controller('GuildPublicCtrl',
  ['$rootScope','$scope', 'User', '$resource', 'API_URL', '$state', '$http', 'Groups',
    function($rootScope, $scope, User, $resource, API_URL, $state, $http, Groups) {

      $scope._publicGuilds = [];
      $scope.publicGuilds = [];
      $scope.noMoreGuilds = false;

      var startSyncing = function(){
        $rootScope.syncing = true;
      }
      var doneSyncing = function(){
        $rootScope.syncing = false;
      }

      $scope.syncPublicGuilds = function() {
        startSyncing();
        Groups.Group.query({type:'guilds'}).$promise.then(function(myGuilds) {
          $scope.$parent.guilds = myGuilds;
          Groups.Group.query({type:'public'}).$promise.then(function(guilds) {
            $scope._publicGuilds = guilds;
            if ($scope.publicGuilds.length == 0) {
              $scope.loadMore(8);
            } else {
              $scope.loadMore(0);
            }
            doneSyncing();
          })
        });
      }

      $scope.loadMore = function(amount) {
        $scope.publicGuilds = $scope._publicGuilds.slice(0, $scope.publicGuilds.length+amount);
        if ($scope._publicGuilds.length === $scope.publicGuilds.length) {
          $scope.noMoreGuilds = true;
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }

      $scope.isMyGuild = function(guild) {
        var res = false;
        $scope.guilds.forEach(function(myGuild) {
          if (guild._id == myGuild._id) {
            res = true;
          }
        })
        return res;
      }

      $scope.join = function(guild) {
        guild.$join().finally(function() {
          $scope.syncPublicGuilds();
        });
      }

      $scope.leave = function(guild) {
        Groups.Group.leave({gid: guild._id, keep: false}, undefined, function() {
          $scope.syncPublicGuilds();
        });
      }

      $scope.syncPublicGuilds();
    }
  ]);
