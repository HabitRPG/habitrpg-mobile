'use strict';

/**
 * The main HabitRPG app module.
 *
 * @type {angular.Module}
 */
var habitrpg = angular.module('habitrpg', [])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/list.html',
                controller: 'TodoCtrl'
            })
            .when('/active', {
                templateUrl: 'views/list.html',
                controller: 'TodoCtrl'
            })
            .when('/completed', {
                templateUrl: 'views/list.html',
                controller: 'TodoCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    }]);
