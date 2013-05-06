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
      $scope.originalTask = _.clone($scope.task); // TODO deep clone?;
      $scope.editing = true;
  };

  $scope.save = function() {
      User.log({op: 'edit_task', task: $scope.task});
      User.save();
      $scope.originalTask = null;
      $scope.editing = false;
  };

  $scope.cancel = function() {
      $scope.task = $scope.originalTask;
      $scope.originalTask = null;
      $scope.editing = false;
  }

  $scope.delete = function() {
      $scope.task.del = true;
      User.log({op: 'delete_task', task: $scope.task.id});
      User.save()
      $scope.goBack();
  };


});
