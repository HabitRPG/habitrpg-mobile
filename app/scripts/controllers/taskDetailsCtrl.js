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
      $scope.editedTask = $scope.task;
      $scope.editing = true;
  };

  $scope.save = function() {
      User.log({op: 'edit_task', task: $scope.task});
      User.save({callback: function(user){
        var task = _.findWhere(user.tasks, {id: $scope.task.id});
        $rootScope.selectedTask = task;
        $scope.task = task;
      }});
      $scope.originalTask = null;
      $scope.editedTask = null;
      $scope.editing = false;
  };

  $scope.cancel = function() {
      // reset $scope.task to $scope.originalTask
      for(var key in $scope.task){
        $scope.task[key] = $scope.originalTask[key];
      }
      $scope.originalTask = null;
      $scope.editedTask = null;
      $scope.editing = false;
  }

  $scope.delete = function() {
      $scope.task.del = true;
      User.log({op: 'delete_task', task: $scope.task.id});
      User.save();
      $scope.goBack();
  };


});
