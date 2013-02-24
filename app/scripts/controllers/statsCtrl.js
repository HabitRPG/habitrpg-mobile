'use strict';

/*

Statz controller

- Retrieves statz from localStorage.
- Exposes the model to the template and provides event handlers


*/


habitrpg.controller( 'StatsCtrl', function StatsCtrl( $scope, $location, filterFilter, characterData ) {


 var character = characterData.getData()

 var stats = $scope.stats = {}

 if (character) {
 $scope.stats.health = character.stats.hp;
 $scope.stats.exp = character.stats.exp
 }


 $scope.$on('characterUpdate', function() {

  character = characterData.getData()

  $scope.stats.health = character.stats.hp;
  $scope.stats.exp = character.stats.exp

  $scope.$apply()

 });





});