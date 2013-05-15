'use strict';

/**
 * The main HabitRPG app module.
 *
 * @type {angular.Module}
 */
var habitrpg = angular.module('habitrpg', ['userServices', 'sharedServices', 'authServices'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/:action', {templateUrl: 'views/list.html'})
            .when('/tasks/:taskId', {templateUrl: 'views/details.html'})
            .when('/todo/active', {templateUrl: 'views/list.html'})
            .when('/todo/completed', {templateUrl: 'views/list.html'})
            .otherwise({redirectTo: '/habit'});
    }])
    .config(['$compileProvider', function($compileProvider) {
            $compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
    }]);


// Touch directive, binding to touchstart as to not wait for 300ms

habitrpg.directive('gfTap', function() {
  return function(scope, element, attrs) {
    element.bind('touchstart', function() {
      scope.$apply(attrs['gfTap']);
    });
  };
});

habitrpg.directive('sort', function() {

  return{

    link: function(scope, element, attrs, ngModel) {


      scope.$watch('tasks', function() {

        $(document).bind('touchmove', function(e) {
          e.preventDefault();
        }, false);

        $(element).sortable('destroy')
        $(element).sortable()
        console.log('added')

      }, true)

    }

  }

})