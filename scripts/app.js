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

//.constant('API_URL', 'https://habitrpg.com')
.constant('API_URL', 'http://localhost:3000')
.constant("STORAGE_USER_ID", 'habitrpg-user')
.constant("STORAGE_SETTINGS_ID", 'habit-mobile-settings')
.constant("MOBILE_APP", true)

.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider
    .when('/app', '/app/tasks/habit')
    .when('/app/chat', '/app/chat/tavern')
    .when('/auth', '/auth/login')
    .otherwise(function ($injector, $location) {
      var user = JSON.parse(localStorage.getItem('habitrpg-user'));
      return user && user.apiToken ? 'app/tasks/habit' : 'auth/login';
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
    .state('app.tasks', {
      url: '/tasks',
      abstract:true,
      views: {
        menuContent: {
          templateUrl: 'views/app.tasks.html'
        }
      }
    })
    .state('app.tasks.habit', {
      url: '/habit',
      views: {
        habit: {
          templateUrl: 'views/app.tasks.habit.html',
          controller: "TasksCtrl"
        }
      }
    })
    .state('app.tasks.daily', {
      url: '/daily',
      views: {
        daily: {
          templateUrl: 'views/app.tasks.daily.html',
          controller: "TasksCtrl"
        }
      }
    })
    .state('app.tasks.todo', {
      url: '/todo',
      views: {
        todo: {
          templateUrl: 'views/app.tasks.todo.html',
          controller: "TasksCtrl"
        }
      }
    })
    .state('app.tasks.todo.completed', {
      url: '/completed'
    })
    .state('app.tasks.reward', {
      url: '/reward',
      views: {
        reward: {
          templateUrl: 'views/app.tasks.reward.html',
          controller: "TasksCtrl"
        }
      }
    })

    // Edit
    // FIXME this is dumb to have 4 routes for the same thing. However, ionic doens't allow tab-stacking for deeper routes. They have to be sibling routes. Aka, app.tasks.habit.view doesn't work, has to be app.tasks.habit-view
    .state('app.tasks.habitView', {
      url: '/view/:tid',
      views: {
        habit:{
          controller: 'TasksCtrl',
          templateUrl: 'views/app.task.html'
        }
      }
    })
    .state('app.tasks.dailyView', {
      url: '/view/:tid',
      views: {
        daily:{
          controller: 'TasksCtrl',
          templateUrl: 'views/app.task.html'
        }
      }
    })
    .state('app.tasks.todoView', {
      url: '/view/:tid',
      views: {
        todo:{
          controller: 'TasksCtrl',
          templateUrl: 'views/app.task.html'
        }
      }
    })
    .state('app.tasks.rewardView', {
      url: '/view/:tid',
      views: {
        reward:{
          controller: 'TasksCtrl',
          templateUrl: 'views/app.task.html'
        }
      }
    })

    // Chat
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