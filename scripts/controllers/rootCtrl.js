'use strict';

// Make user and settings available for everyone through root scope.
habitrpg.controller('RootCtrl',
  ['$scope', '$rootScope', '$location', '$ionicNavBarDelegate', 'User', '$state', '$stateParams', '$window', '$ionicPlatform', 'Groups', 'API_URL',
  function ($scope, $rootScope, $location, $ionicNavBarDelegate, User, $state, $stateParams, $window, $ionicPlatform, Groups, API_URL) {

    $rootScope.User = User;
    $rootScope.user = User.user;
    $rootScope.set = User.set;
    $rootScope.settings = User.settings;
    $rootScope.settings.auth.apiEndpoint = API_URL;

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
        $rootScope.$broadcast('scroll.refreshComplete');
      } else if($state.includes('app.tasks')) {
        User.log({});
        $state.refresh();
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

    // styling helpers
    $rootScope.userLevelStyle = function(user,style){
      style = style || '';
      if(user && user.backer && user.backer.npc)
        style += ' label-npc';
      if(user && user.contributor && user.contributor.level)
        style += ' label-contributor-'+user.contributor.level;
      return style;
    }

    $rootScope.$watch('User.settings.fetching',function(fetching){
      if (fetching) $rootScope.$broadcast('scroll.refreshComplete')
    })

    $rootScope.externalLink = function(link){
      window.open(link,'_system');
    }

    $rootScope.goBack = function() {
      history.back();
    }

    $rootScope.getPreviousTitle = function() {
      return $ionicNavBarDelegate.getPreviousTitle();
    }

    $scope.hideBackButton = function() {
      var baseRoutes = /^\/app((\/|\/(?!task\/)([a-zA-Z]*)\/)[^\/]+$)/;
      if ( baseRoutes.test($location.path()) ) {
        return true;
      }
      return false;
    }
  }
]);
