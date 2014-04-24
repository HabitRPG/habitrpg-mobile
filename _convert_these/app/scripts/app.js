'use strict';

/**
 * The main HabitRPG app module.
 */
var habitrpg = angular.module('habitrpg', ['userServices', 'authServices', 'notificationServices', 'ngTouch', 'ngSanitize', 'ngResource', 'ui.router'])

    .constant('API_URL', 'https://habitrpg.com')
//    .constant('API_URL', 'http://localhost:3000')
    .constant("STORAGE_USER_ID", 'habitrpg-user')
    .constant("STORAGE_SETTINGS_ID", 'habit-mobile-settings')
    .constant("MOBILE_APP", true)

    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
      $urlRouterProvider
        .when('/profile', '/profile/view')
        .when('/login', '/login/login')
        .otherwise("/habit");

      $stateProvider
        .state('login', {url: "/login", abstract:true, template: '<div ui-view></div>'})
        .state('login.login', {url: "/login",     templateUrl: 'views/login.login.html', controller: 'AuthCtrl'})
        .state('login.register', {url: "/register",     templateUrl: 'views/login.register.html', controller: 'AuthCtrl'})

        .state('settings', {url: '/settings',  templateUrl: 'views/settings.html'})
        .state('help',     {url: '/help',      templateUrl: 'views/help.html'})

        .state('profile',  {url: '/profile',   templateUrl: 'views/profile.html'})
        .state('profile.view',  {url: '/view',   templateUrl: 'views/profile.view.html'})
        .state('profile.customize',  {url: '/customize',   templateUrl: 'views/profile.customize.html'})

        .state('task', {
          url:'/tasks/:taskId',
          templateUrl: 'views/details.html'
        })

        .state('habit', {
          url: '/habit',
          templateUrl: 'views/list.html',
          controller: ['$scope', function($scope){
            $scope.nav = {name:'Habits',type:'habit',singular:'Habit'};
            console.log('test');
          }]
        })
        .state('daily', {
          url: '/daily',
          templateUrl: 'views/list.html',
          controller: ['$scope', function($scope){
            $scope.nav = {name:'Dailies',type:'daily',singular:'Daily'};
          }]
        })
        .state('todo', {
          url: '/todo',
          templateUrl: 'views/list.html',
          controller: ['$scope', function($scope){
            $scope.nav = {name:'To-Dos',type:'todo',singular:'To-Do'};
          }]
        })
        .state('reward', {
          url: '/reward',
          templateUrl: 'views/list.html',
          controller: ['$scope', function($scope){
            $scope.nav = {name:'Rewards',type:'reward',singular:'Reward'};
          }]
        })

        //.state('todo.active',      {url: '/active', templateUrl: 'views/list.html'})
        .state('todo.completed',   {url: '/completed', templateUrl: 'views/list.html'})

    }])

    // FIXME remove? Looks like this was now added as the default: https://github.com/angular/angular.js/commit/3e39ac7e1b10d4812a44dad2f959a93361cd823b
    // also, urlSanitizationWhitelist has been replaced with aHrefSanitizationWhitelist and imgSrcSanitizationWhitelist ,
    // so if this is *not* the case we'll need to update this code after uncommenting (see https://github.com/angular/angular.js/blob/master/CHANGELOG.md)
//    .config(['$compileProvider', function ($compileProvider) {
//        $compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
//    }]);

