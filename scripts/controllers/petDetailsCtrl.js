'use strict';

habitrpg.controller('PetDetailsCtrl',
  ['$scope','User','$state',
    function($scope, User, $state) {
      console.log($state)
      $scope.pet = $state.params.pet;
    }
  ]);