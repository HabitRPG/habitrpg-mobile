'use strict';

/**
 * The main HabitRPG app module.
 *
 * @type {angular.Module}
 */
var habitrpg = angular.module('habitrpg', [])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/*', {templateUrl: 'views/list.html'})
            .when('/*/:taskId', {templateUrl: 'views/details.html'})
            .when('/*/:taskId/edit', {templateUrl: 'views/details.html'})
            .when('/todo/active', {templateUrl: 'views/list.html'})
            .when('/todo/completed', {templateUrl: 'views/list.html'})
            .otherwise({redirectTo: '/habit'});
    }]);
