'use strict';

// Make user and settings available for everyone through root scope.
habitrpg.controller('RootCtrl',
  ['$scope', '$rootScope', '$location', 'User', '$state', '$stateParams', '$window', '$ionicPlatform',
  function ($scope, $rootScope, $location, User, $state, $stateParams, $window, $ionicPlatform) {

    var adsInited = false;
    $rootScope.$on('userSynced', function(){
      $ionicPlatform.ready(function() {

        // having issues on some devices
        var v = ionic.Platform.version();v = v && Number(v).toFixed(1);
        var deviceSupported = (!ionic.Platform.isIOS() && !(ionic.Platform.isAndroid() && v=='4.1'));

        if( window.plugins && window.plugins.AdMob && deviceSupported) {
          var am = window.plugins.AdMob;

          // Remove ads / return if user is subscriber
          if (User.user.purchased.plan.customerId || User.user.purchased.ads) {
            if (adsInited) {
              am.destroyBannerView();
              adsInited = false;
            }
            return;
          }
          if (adsInited) return;
          adsInited = true;

          var admob_ios_key = ADMOB_IOS_KEY;
          var admob_android_key = ADMOB_ANDROID_KEY;
          var adId = (navigator.userAgent.indexOf('Android') >=0) ? admob_android_key : admob_ios_key;

          am.createBannerView(
            {
              'publisherId': adId,
              'adSize': am.AD_SIZE.BANNER,
              'bannerAtTop': true
            },
            function() {
              am.requestAd(
                { 'isTesting':false },
                function(){
                  am.showAd( true );
                },
                function(){ console.error('failed to request ad'); }
              );
            },
            function(){ console.error('failed to create banner view'); }
          );
        } else {
          console.error('AdMob plugin not available/ready.');
        }
      });
    });

    $rootScope.User = User;
    $rootScope.user = User.user;
    $rootScope.set = User.set;
    $rootScope.settings = User.settings;

    $rootScope.Shared = $window.habitrpgShared;
    $rootScope.Content = $window.habitrpgShared.content;
    $rootScope.moment = $window.moment;
    $rootScope.Math = $window.Math;

    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

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
  }
]);
