'use strict';

/**
 * The main HabitRPG app module.
 */
var habitrpg = angular.module('habitrpg', ['ionic', 'userServices', 'authServices', 'notificationServices', 'ngSanitize', 'ngAnimate'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

//.constant('API_URL', 'https://habitrpg.com')
.constant('API_URL', 'http://localhost:3000')
.constant("STORAGE_USER_ID", 'habitrpg-user')
.constant("STORAGE_SETTINGS_ID", 'habit-mobile-settings')
.constant("MOBILE_APP", true)

.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider
    .when('/app', '/auth/habit')
    .when('/auth', '/auth/login')
    .otherwise(function ($injector, $location) {
      var user = JSON.parse(localStorage.getItem('habitrpg-user'));
      return user && user.apiToken ? 'app/habit' : 'auth/login';
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
    .state('app.help', {
      url: '/help',
      views: {
        menuContent: {
          templateUrl: 'views/app.help.html'
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

    .state('app.habit', {
      url: '/habit',
      views: {
        menuContent: {
          templateUrl: 'views/app.list.html',
          controller: 'HabitsCtrl'
        }
      }
    })
    .state('app.daily', {
      url: '/daily',
      views: {
        menuContent: {
          templateUrl: 'views/app.list.html',
          controller: 'DailysCtrl'
        }
      }
    })
    .state('app.todo', {
      url: '/todo',
      views: {
        menuContent: {
          templateUrl: 'views/app.list.html',
          controller: 'TodosCtrl'
        }
      }
    })
    //.state('app.todo.active', {url: '/active', templateUrl: 'views/app.list.html'})
    .state('app.todo.completed', {
      url: '/completed',
      views: {
        menuContent: {
          templateUrl: 'views/app.list.html'
        }
      }
    })
    .state('app.reward', {
      url: '/reward',
      views: {
        menuContent: {
          templateUrl: 'views/app.list.html',
          controller: 'RewardsCtrl'
        }
      }
    })

}])