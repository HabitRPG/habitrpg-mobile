'use strict';

/**
 * The main HabitRPG app module.
 */
var habitrpg = angular.module('habitrpg', ['ionic', 'userServices', 'authServices', 'notificationServices', 'ngSanitize', 'ngAnimate', 'ngResource'])

.run(['$ionicPlatform','$rootScope',function($ionicPlatform,$rootScope) {
  $ionicPlatform.ready(function() {
    $rootScope.isIOS = $ionicPlatform.is('iOS');
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
}])

.constant('API_URL', 'https://habitrpg.com')
//.constant('API_URL', 'http://localhost:3000')
.constant("STORAGE_USER_ID", 'habitrpg-user')
.constant("STORAGE_SETTINGS_ID", 'habit-mobile-settings')
.constant("MOBILE_APP", true)

.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider
    .when('/app', '/app/tasks')
    .when('/app/chat', '/app/chat/tavern')
    .when('/auth', '/auth/login')
    .otherwise(function ($injector, $location) {
      var user = JSON.parse(localStorage.getItem('habitrpg-user'));
      return user && user.apiToken ? 'app/tasks' : 'auth/login';
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
    .state('auth.facebook', {
      url: "/facebook",
      templateUrl: 'views/auth.facebook.html'
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
      views: {
        menuContent: {
          templateUrl: 'views/app.profile.html'
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
      views: {
        menuContent: {
          templateUrl: 'views/app.tasks.html',
          controller: "TasksCtrl"
        }
      }
    })
//    .state('app.daily', {
//      url: '/daily',
//      views: {
//        menuContent: {
//          templateUrl: 'views/app.daily.html',
//          controller: "TasksCtrl"
//        }
//      }
//    })
//    .state('app.todo', {
//      url: '/todo',
//      views: {
//        menuContent: {
//          templateUrl: 'views/app.todo.html',
//          controller: "TasksCtrl"
//        }
//      }
//    })
    .state('app.tasks.completed', {
      url: '/completed'
    })
//    .state('app.reward', {
//      url: '/reward',
//      views: {
//        menuContent: {
//          templateUrl: 'views/app.reward.html',
//          controller: "TasksCtrl"
//        }
//      }
//    })

    .state('app.chat', {
      url:'/chat',
      abstract: true,
      views: {
        menuContent: {
          templateUrl:'views/app.chat.html',
          controller: 'ChatCtrl'
        }
      }
    })
    .state('app.chat.tavern', {
      url: '/tavern',
      templateUrl: 'views/app.chat.list.html',
      data: {gid: 'habitrpg'},
      controller: ['$scope', function($scope){
        $scope.query();
      }]
    })
    .state('app.chat.party', {
      url: '/party',
      templateUrl: 'views/app.chat.list.html',
      data: {gid: 'party'},
      controller: ['$scope', function($scope){
        $scope.query();
      }]
    })

}])