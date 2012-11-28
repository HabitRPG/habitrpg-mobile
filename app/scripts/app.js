'use strict';

/**
 * The main HabitRPG app module.
 *
 * @type {angular.Module}
 */
var habitrpg = angular.module('habitrpg', [])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/habit', {
                templateUrl: 'views/list.html'
            })
            .when('/daily', {
                templateUrl: 'views/list.html'
            })
            .when('/todo', {
                templateUrl: 'views/list.html'
            })
            .when('/todo/active', {
                templateUrl: 'views/list.html'
            })
            .when('/todo/completed', {
                templateUrl: 'views/list.html'
            })
            .when('/reward', {
                templateUrl: 'views/list.html'
            })
            .otherwise({
                redirectTo: '/habit'
            });
    }]);
