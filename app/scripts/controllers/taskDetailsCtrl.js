'use strict';

habitrpg.controller( 'TaskDetailsCtrl', function TaskDetailsCtrl( $scope, $rootScope, $location, User) {

  $scope.task = $rootScope.selectedTask;
  $scope.editing = false;
  $scope.editedTask = null;

  $scope.goBack = function(){
    $rootScope.selectedTask = null;
    $location.path('/' + $scope.task.type);
  }

  $scope.edit = function() {
      $scope.editedTask = _.clone($scope.task); // TODO deep clone?;
      $scope.editing = true;
  };

  $scope.save = function() {
      $scope.task = $scope.editedTask;
      User.save()
      $scope.editing = false;
      $scope.$apply()
  };

  $scope.cancel = function() {
      $scope.editedTask = null;
      $scope.editing = false;
  }

  $scope.delete = function() {
      $scope.task.del = true;
      User.save()
      $scope.goBack();
  };


});
