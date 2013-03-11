'use strict';

/**
 * The main HabitRPG app module.
 *
 * @type {angular.Module}
 */
var habitrpg = angular.module('habitrpg', ['userServices'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/', {templateUrl: 'views/list.html'})
            .when('/*', {templateUrl: 'views/list.html'})
            .when('/*/:action', {templateUrl: 'views/list.html'})
            .when('/*/:taskId', {templateUrl: 'views/details.html'})
            .when('/*/:taskId/edit', {templateUrl: 'views/details.html'})
            .when('/todo/active', {templateUrl: 'views/list.html'})
            .when('/todo/completed', {templateUrl: 'views/list.html'})
            .otherwise({redirectTo: '/'});
    }]);


// Touch directive, binding to touchstart as to not wait for 300ms

habitrpg.directive('gfTap', function() {
  return function(scope, element, attrs) {
    element.bind('touchstart', function() {
      scope.$apply(attrs['gfTap']);
    });
  };
});