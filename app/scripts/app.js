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

habitrpg.factory('characterData', function($rootScope, characterStorage) {

  var data;

  return {

    getData: function() { 

      return data; 
    },

    setData: function(sentdata) { 
     
      data = sentdata;
      characterStorage.put(data)
      $rootScope.$broadcast('characterUpdate')


    }

  }

})
