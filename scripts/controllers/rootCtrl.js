'use strict';

// Make user and settings available for everyone through root scope.
habitrpg.controller('RootCtrl',
  ['$scope', '$rootScope', '$location', 'User', '$state', '$stateParams', '$window', '$ionicPlatform', 'Groups',
  function ($scope, $rootScope, $location, User, $state, $stateParams, $window, $ionicPlatform, Groups) {

    $rootScope.User = User;
    $rootScope.user = User.user;
    $rootScope.set = User.set;
    $rootScope.settings = User.settings;

    $rootScope.Shared = $window.habitrpgShared;
    $rootScope.Content = $window.habitrpgShared.content;
    $rootScope.moment = $window.moment;
    $rootScope.Math = $window.Math;
    $rootScope.env = $window.env;

    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    $rootScope.party = Groups.party();

    $rootScope.sync = function(){
      if ($state.includes('app.chat')) {
        var scope = angular.element(document.getElementById('chatCtrl-list')).scope();
        scope.query(scope.gid);
      } else {
        User.log({});
      }
    }

    $rootScope.authenticated = function() {
      return (User.settings.auth.apiId != '');
    }

    // FIXME is this used anywhere?
    $scope.queueLength = function () {
      return User.settings.sync.queue.length || User.settings.sync.sent.length
    };

    $rootScope.$watch('User.settings.fetching',function(fetching){
      if (fetching) $rootScope.$broadcast('scroll.refreshComplete')
    })

    $rootScope.externalLink = function(link){
      window.open(link,'_system');
    }

    $rootScope.goBack = function() {
      history.back();
    }
  }
]);
