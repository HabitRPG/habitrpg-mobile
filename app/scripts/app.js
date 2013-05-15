'use strict';

/**
 * The main HabitRPG app module.
 *
 * @type {angular.Module}
 */
var habitrpg = angular.module('habitrpg', ['userServices', 'sharedServices', 'authServices', 'notificationServices'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/login', {templateUrl: 'views/login.html'})
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

habitrpg.directive('gfTap', ["$location", "$parse", function($location, $parse) {
  return function(scope, element, attrs) {
    var tapping = false
    element.bind('touchstart', function() {
      tapping = true;
    })

    element.bind('touchmove', function() {
      tapping = false
    })

    element.bind('touchend', function(event) {
      if (tapping) {
        var fn       = $parse(attrs['gfTap'])
        
        if (attrs['href']) {
          var location = attrs['href'].replace('#', '/')
          $location.path(location);
        }

        scope.$apply(function() {
          fn(scope, {$event:event})
        });
      }
    });

  };
}]);

habitrpg.directive('sort', function() {

  return{

    link: function(scope, element, attrs, ngModel) {


      scope.$watch('tasks', function() {

        $(document).bind('touchmove', function(e) {
          e.preventDefault();
        }, false);

        $(element).sortable('destroy')
        $(element).sortable()

      }, true)

    }

  }

})