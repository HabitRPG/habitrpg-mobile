'use strict';

/*

Statz controller

- Retrieves statz from localStorage. If not present, set fake data
- Exposes the model to the template and provides event handlers


*/


habitrpg.controller( 'StatsCtrl', function StatsCtrl( $scope, $location, statzStorage, filterFilter ) {

 var stats = $scope.stats = statzStorage.get()


 $scope.$watch('stats', function() {

 	statzStorage.put(stats);

 }, true)

 $scope.updateStats = function(key,value) {

    switch(key) {

      case 'health':
      stats.health = value;
      break;
      case 'exp':
      stats.exp    = value;
      break;

    }

 }

 $scope.updateStats('health', '90%')





});