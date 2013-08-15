'use strict';

/**
 * The main HabitRPG app module.
 *
 * @type {angular.Module}
 */


var habitrpg = angular.module('habitrpg', ['userServices', 'sharedServices', 'authServices', 'notificationServices', 'ngMobile'])

//    .constant('API_URL', 'https://beta.habitrpg.com')
    .constant('API_URL', 'https://beta.habitrpg.com')

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider

            .when('/login',           {templateUrl: 'views/login.html'})
            .when('/settings',        {templateUrl: 'views/settings.html'})
            .when('/profile',         {templateUrl: 'views/profile.html'})

            .when('/tasks/:taskId',   {templateUrl: 'views/details.html'})

            .when('/habit',           {templateUrl: 'views/list.html'})
            .when('/daily',           {templateUrl: 'views/list.html'})
            .when('/todo',            {templateUrl: 'views/list.html'})
            .when('/reward',          {templateUrl: 'views/list.html'})

            .when('/todo/active',     {templateUrl: 'views/list.html'})
            .when('/todo/completed',  {templateUrl: 'views/list.html'})

            .otherwise({redirectTo: '/habit'}); // userServices handles redirect to /login if not authenticated
    }])
    .config(['$compileProvider', function ($compileProvider) {
        $compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
    }]);

