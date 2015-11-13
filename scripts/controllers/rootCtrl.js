'use strict';

// Make user and settings available for everyone through root scope.
habitrpg.controller('RootCtrl',
  ['$scope', '$rootScope', '$location', '$ionicNavBarDelegate', 'User', '$state', '$stateParams', '$window', '$ionicPlatform', 'Groups', 'ApiUrl', '$http', 'API_URL',
      '$ionicPopup', '$ionicModal', 'Stats', 
  function ($scope, $rootScope, $location, $ionicNavBarDelegate, User, $state, $stateParams, $window, $ionicPlatform, Groups, ApiUrl, $http, API_URL, $ionicPopup, $ionicModal, Stats) {

    $rootScope.statCalc = Stats;

    $rootScope.User = User;
    $rootScope.user = User.user;
    $rootScope.set = User.set;
    $rootScope.settings = User.settings;
    $rootScope.settings.auth.apiEndpoint = API_URL;

    $rootScope.postData = function(endpoint, data){
      return $http.post(ApiUrl.get()+endpoint, data);
    };

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


    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://habitica-assets.s3.amazonaws.com/mobileApp/endpoint/killswitch.json", true);
    xhr.onload = function (e) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          var response = JSON.parse(xhr.responseText);
          if ($ionicPlatform.is('ios')) {
            var platformData = response.ios;
          } else if ($ionicPlatform.is('android')) {
            var platformData = response.android;
          } else {
            return;
          }
          if (platformData.killswitch) {
            $ionicModal.fromTemplateUrl('views/app.modals.killswitch.html', {
                scope: $scope,
              }).then(function(modal) {
                $scope.modal = modal
                $scope.killswitchMessage = platformData.killswitchMessage
                $scope.storeUrl = platformData.storeUrl
                $scope.modal.show()
              })
          } else if (platformData.warning) {
            var confirmPopup = $ionicPopup.confirm({
              title: 'Warning',
              template: platformData.warningMessage,

              okText: 'Open Store' // String (default: 'OK'). The text of the OK button.
             });

            confirmPopup.then(function(res) {
              if(res) {
                // open url
                $rootScope.externalLink(platformData.storeUrl);
              } else {
                // Cancel
              }
            });
          } else if (platformData.newApp) {
            if($ionicPlatform.is('ios')) {
              var versionToCheck = ionic.Platform.version().toString();

              var splittedVersion = versionToCheck.split('.');

              if(splittedVersion[0] == '7' || splittedVersion[0] == '8' || splittedVersion[0] == '9') {
                var confirmPopup = $ionicPopup.confirm({
                  title: 'Update',
                  template: 'We’ve released an improved, updated app: Habitica! This old app will no longer receive updates. Click "Open Store" to download the new app now.',

                  okText: 'Open Store' // String (default: 'OK'). The text of the OK button.
                 });

                confirmPopup.then(function(res) {
                  if(res) {
                    // open url
                    $rootScope.externalLink(platformData.storeUrl);
                  } else {
                    // Cancel
                  }
                });
              }
            } else if ($ionicPlatform.is('android')) {
            }
          }
        } else {
          console.error(xhr.statusText);
        }
      }
    };
    xhr.onerror = function (e) {
      console.error(xhr.statusText);
    };
    xhr.send(null);
  }
]);
