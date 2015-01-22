'use strict';

var pushNotification, onNotification;

document.addEventListener("deviceready", function(){
  if (window.analytics) {
    analytics.startTrackerWithId("UA-33510635-2");
    var uuid = angular.element(document.body).scope().User.user._id;
    uuid && analytics.setUserId(uuid);
  }
  
  if(window.store){
    var store = window.store;

    store.ready(function(){
      // store is ready :)
    });

    store.refresh();
  }

  if (window.plugins.pushNotification) {
    pushNotification = window.plugins.pushNotification;

    var $scope = angular.element(document.body).scope();

    if (device.platform == 'android' || device.platform == 'Android') {
      console.info("start");
      console.info('<li>registering ' + device.platform + '</li>');

      onNotification =  function (e) {
        console.info('<li>EVENT -> RECEIVED:' + e.event + '</li>');

        switch( e.event )
        {
          case 'registered':
            if ( e.regid.length > 0 )
            {
              $scope.postData('/user/pushDevice', {regId: e.regid, type: 'android'});

              console.info('<li>REGISTERED -> REGID:' + e.regid + "</li>");
              // Your GCM push server needs to know the regID before it can push to this device
              // here is where you might want to send it the regID for later use.
              console.log("regID = " + e.regid);
            }
            break;

          case 'message':
            // if this flag is set, this notification happened while we were in the foreground.
            // you might want to play a sound to get the user's attention, throw up a dialog, etc.
            if ( e.foreground )
            {
              console.info('<li>--INLINE NOTIFICATION--' + '</li>');

              // on Android soundname is outside the payload.
              // On Amazon FireOS all custom attributes are contained within payload
             // var soundfile = e.soundname || e.payload.sound;
              // if the notification contains a soundname, play it.
             // var my_media = new Media("/android_asset/www/"+ soundfile);
             // my_media.play();
            }
            else
            {  // otherwise we were launched because the user touched a notification in the notification tray.
              if ( e.coldstart )
              {
                console.info('<li>--COLDSTART NOTIFICATION--' + '</li>');
              }
              else
              {
                console.info('<li>--BACKGROUND NOTIFICATION--' + '</li>');
              }
            }

            console.info('<li>MESSAGE -> MSG: ' + e.payload.message + '</li>');
            //Only works for GCM
            console.info('<li>MESSAGE -> MSGCNT: ' + e.payload.msgcnt + '</li>');
            //Only works on Amazon Fire OS
            console.info('<li>MESSAGE -> TIME: ' + e.payload.timeStamp + '</li>');
            break;

          case 'error':
            console.info('<li>ERROR -> MSG:' + e.msg + '</li>');
            break;

          default:
            console.info('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
            break;
        }
      };
      
      pushNotification.register(
          function (result) {
            alert('result = ' + result);
          },
          function(error){
            alert('error = '+error);
          },
          {
            "senderID": "20738163915",
            "ecb": "onNotification"
          });
    }
  }


}, false);

/**
 * The main HabitRPG app module.
 */
var habitrpg = angular.module('habitrpg', ['ionic', 'userServices', 'groupServices', 'notificationServices', 'storeServices', 'ngResource'])

.run(['$ionicPlatform','$rootScope',function($ionicPlatform,$rootScope) {
  $ionicPlatform.ready(function() {
    $rootScope.isIOS = $ionicPlatform.is('iOS');
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
  
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
    if (window.analytics) {
      // async defer trackView, since it slows down the app (this should be a background thread op in the cordova plugin, shouldn't it?)
      window.setTimeout(function(){
        analytics.trackView('/#/'+toState.name);
      },0);
    }
  });
}])

.constant('API_URL', localStorage.getItem('habitrpg-endpoint') || 'https://habitrpg.com')
//.constant('API_URL', 'http://localhost:3000')
.constant("STORAGE_USER_ID", 'habitrpg-user')
.constant("STORAGE_SETTINGS_ID", 'habit-mobile-settings')
.constant("MOBILE_APP", true)

.config(['$stateProvider', '$urlRouterProvider', '$provide', '$httpProvider', function ($stateProvider, $urlRouterProvider, $provide, $httpProvider) {
  $urlRouterProvider
    .when('/app', '/app/tasks/habits')
    .when('/app/tasks', '/app/tasks/habits')
    .when('/app/chat', '/app/chat/tavern')
    .when('/auth', '/auth/login')
    .otherwise(function ($injector, $location) {
      var user = JSON.parse(localStorage.getItem('habitrpg-user'));
      return user && user.apiToken ? 'app/tasks/habits' : 'auth/login';
    });

  $stateProvider

    // ---- Auth ----
    .state('auth', {
      url: "/auth",
      abstract: true,
      templateUrl: 'views/auth.html',
      controller: 'AuthCtrl'
    })
    .state('auth.login', {
      url: "/login",
      templateUrl: 'views/auth.login.html'
    })
    .state('auth.register', {
      url: "/register",
      templateUrl: 'views/auth.register.html'
    })

    // ---- App ----
    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'views/app.html'
    })

    // Misc
    .state('app.settings', {
      url: '/settings',
      views: {
        menuContent: {
          templateUrl: 'views/app.settings.html'
        }
      }
    })
    .state('app.about', {
      url: '/about',
      views: {
        menuContent: {
          templateUrl: 'views/app.about.html'
        }
      }
    })

    // Profile
    .state('app.profile', {
      url: '/profile',
      abstract: true,
      views: {
        menuContent: {
          templateUrl: 'views/app.profile.html'
        }
      }
    })

    .state('app.profile.avatar', {
      url: '/avatar',
      templateUrl: 'views/app.profile.avatar.html'
    })

    .state('app.profile.backgrounds', {
      url: '/backgrounds',
      templateUrl: 'views/app.profile.backgrounds.html'
    })

    .state('app.profile.stats', {
      url: '/stats',
      templateUrl: 'views/app.profile.stats.html'
    })

    // Inventory
    .state('app.inventory', {
      url: '/inventory',
      abstract: true,
      views: {
        menuContent: {
          controller: 'InventoryCtrl',
          templateUrl: 'views/app.inventory.html'
        }
      }
    })

    .state('app.inventory.inventory', {
      url: '/inventory',
      templateUrl: 'views/app.inventory.inventory.html'
    })

    .state('app.inventory.market', {
      url: '/market',
      templateUrl: 'views/app.inventory.market.html'
    })

    .state('app.inventory.equipment', {
      url: '/equipment',
      templateUrl: 'views/app.inventory.equipment.html'
    })

    .state('app.equipment-costume', {
      url: '/equipment-costume',
      views: {
        menuContent:{
          controller: 'InventoryCtrl',
          templateUrl: 'views/app.inventory.equipment-costume.html'
        }
      }
    })

    // Stable
    .state('app.stable', {
      url: '/stable',
      abstract: true,
      views: {
        menuContent: {
          controller: 'StableCtrl',
          templateUrl: 'views/app.stable.html'
        }
      }
    })

    .state('app.stable.pets', {
      url: '/pets',
      templateUrl: 'views/app.stable.pets.html'
    })

    .state('app.stable.mounts', {
      url: '/mounts',
      templateUrl: 'views/app.stable.mounts.html'
    })

    .state('app.pet-details', {
      url: '/pet-details/:pet',
      views: {
        menuContent:{
          controller: 'PetDetailsCtrl',
          templateUrl: 'views/app.pet-details.html'
        }
      }
    })

    .state('app.mount-details', {
      url: '/mount-details/:mount',
      views: {
        menuContent:{
          controller: 'MountDetailsCtrl',
          templateUrl: 'views/app.mount-details.html'
        }
      }
    })

    // Tasks
    .state('app.task', {
      url: '/task/:tid',
      views: {
        menuContent:{
          controller: 'TasksCtrl',
          templateUrl: 'views/app.task.html'
        }
      }
    })

    .state('app.tasks', {
      url: '/tasks',
      abstract: true,
      views: {
        menuContent: {
          templateUrl: 'views/app.tasks.html',
          controller: "TasksCtrl"
        }
      }
    })
    .state('app.tasks.habits', {
      url: '/habits',
      templateUrl: 'views/app.tasks.habits.html'
    })
    .state('app.tasks.dailies', {
      url: '/dailies',
      templateUrl: 'views/app.tasks.dailies.html'
    })
    .state('app.tasks.todos', {
      url: '/todos',
      templateUrl: 'views/app.tasks.todos.html'
    })
    .state('app.tasks.todos.completed', {
      url: '/completed'
    })
    .state('app.tasks.rewards', {
      url: '/rewards',
      templateUrl: 'views/app.tasks.rewards.html'
    })

    .state('app.social', {
      url: '/social',
      abstract: true,
      views: {
        menuContent: {
          templateUrl:'views/app.social.html'
        }
      }
    })

    .state('app.social.tavern', {
      url: '/tavern',
      templateUrl: 'views/app.chat.list.html',
      data: {gid: 'habitrpg'},
      controller: 'ChatCtrl'
    })

    .state('app.social.party', {
      url: '/party',
      templateUrl: 'views/app.social.party.html',
      controller: 'PartyCtrl'
    })

    .state('app.social.party-chat', {
      url: '/party-chat',
      templateUrl: 'views/app.chat.list.html',
      data: {gid: 'party'},
      controller: 'ChatCtrl'
    })

    .state('app.social.guilds', {
      url: '/guilds',
      templateUrl: 'views/app.social.guilds.html',
      data: {sync: true},
      controller: 'GuildCtrl'
    })

    .state('app.social.guild-chat', {
      url: '/guild-chat/:gid',
      data: {sync: false, gid: null},
      templateUrl: 'views/app.chat.list.html',
      controller: 'ChatCtrl'
    })

    .state('app.social.public-guilds', {
      url: '/public-guilds',
      data: {sync: true},
      templateUrl: 'views/app.guilds.public.html',
      controller: 'GuildPublicCtrl'
    })
    
    
    .state('app.purchase', {
      url: '/purchase',
      views: {
        menuContent: {
          templateUrl:'views/app.purchase.html',
          controller:'PurchaseCtrl'
        }
      }
    });

    $provide.factory('myHttpInterceptor', ['$rootScope','$q',function($rootScope,$q) {
      return {
        response: function(response) {
          return response;
        },
        responseError: function(response) {
          // Offline
          if (response.status == 0 ||
            // don't know why we're getting 404 here, should be 0
            (response.status == 404 && _.isEmpty(response.data))) {
            // Don't do anything in mobile

            // Needs refresh
          } else if (response.needRefresh) {
            // Don't do anything in mobile (for now)
          } else if (response.data.code && response.data.code === 'ACCOUNT_SUSPENDED') {
            alert(response.data.err)
            localStorage.clear();
            location.reload();

          // 400 range?
          } else if (response.status < 500) {
            $rootScope.$broadcast('responseText', response.data.err || response.data);
            // Need to reject the prompse so the error is handled correctly
            if (response.status === 401) {
              return $q.reject(response);
            }

            // Error
          } else {
            var error = 'Error contacting the server. Please try again in a few minutes.';
            $rootScope.$broadcast('responseError', error);
            console.error(response);
          }

          return response;
          // this completely halts the chain, meaning we can't queue offline actions
          //if (canRecover(response)) return responseOrNewPromise
          //return $q.reject(response);
        }
      };
    }]);
    $httpProvider.interceptors.push('myHttpInterceptor');

}])
