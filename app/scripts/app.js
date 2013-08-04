'use strict';

/**
 * The main HabitRPG app module.
 *
 * @type {angular.Module}
 */

var habitrpg = angular.module('habitrpg', ['userServices', 'sharedServices', 'authServices', 'notificationServices', 'ngMobile'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/home', {templateUrl: 'views/home.html'})
            .when('/login', {templateUrl: 'views/login.html'})
            .when('/settings', {templateUrl: 'views/settings.html'})
            .when('/profile', {templateUrl: 'views/profile.html'})
            .when('/:action', {templateUrl: 'views/list.html'})
            .when('/tasks/:taskId', {templateUrl: 'views/details.html'})
            .when('/todo/active', {templateUrl: 'views/list.html'})
            .when('/todo/completed', {templateUrl: 'views/list.html'})
            .otherwise({redirectTo: '/habit'});
    }])
    .config(['$compileProvider', function ($compileProvider) {
        $compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
    }]);

