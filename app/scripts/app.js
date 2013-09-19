'use strict';

/**
 * The main HabitRPG app module.
 *
 * @type {angular.Module}
 */


var habitrpg = angular.module('habitrpg', ['userServices', 'sharedServices', 'authServices', 'notificationServices', 'ngTouch', 'ngRoute', 'ngSanitize'])

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

            .when('/help',            {templateUrl: 'views/help.html'})

            .otherwise({redirectTo: '/habit'}); // userServices handles redirect to /login if not authenticated
    }])

    // FIXME remove? Looks like this was now added as the default: https://github.com/angular/angular.js/commit/3e39ac7e1b10d4812a44dad2f959a93361cd823b
    // also, urlSanitizationWhitelist has been replaced with aHrefSanitizationWhitelist and imgSrcSanitizationWhitelist ,
    // so if this is *not* the case we'll need to update this code after uncommenting (see https://github.com/angular/angular.js/blob/master/CHANGELOG.md)
//    .config(['$compileProvider', function ($compileProvider) {
//        $compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
//    }]);

