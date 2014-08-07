'use strict';

/**
 * The main HabitRPG app module.
 */
var habitrpg = angular.module('habitrpg', ['ionic', 'userServices', 'authServices', 'groupServices', 'notificationServices', 'ngResource'])

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

    .state('app.guilds', {
      url:'/guilds',
      views: {
        menuContent: {
          templateUrl:'views/app.guilds.html',
          controller: 'GuildCtrl'
        }
      }
    })
    .state('app.chat.guild', {
      url: '/guilds/:gid',
      templateUrl: 'views/app.chat.list.html',
      data: {gid: null},
      controller: ['$scope', '$state', function($scope, $state){
        console.log($state.params.gid)
        $state.current.data.gid = $state.params.gid;
        $scope.query();
      }]
    })

}])
