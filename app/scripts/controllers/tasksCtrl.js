'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persist the model via the todoStorage service
 * - exposes the model to the template and provides event handlers
 */
habitrpg.controller( 'TasksCtrl', function TasksCtrl( $scope, $location, filterFilter, User ) {

  $scope.newTask = "";
  $scope.editedTask = null;

  User.fetch(function(user){
      var tasks = $scope.tasks = user.tasks

      $scope.$watch('tasks', function() {
          $scope.remainingCount = filterFilter(tasks, {completed: false}).length;
          $scope.doneCount = tasks.length - $scope.remainingCount;
          $scope.allChecked = !$scope.remainingCount
          User.save();
      }, true);

      if ( $location.path() === '' ) $location.path('/');
      $scope.location = $location;

      $scope.$watch( 'location.path()', function( path ) {
          var type = $scope.taskType = path.split('/')[1];
          $scope.taskFilter = { type: type }
          $scope.taskTypeTitle =
              (type == 'habit')  ? 'Habits' :
              (type == 'daily')  ? 'Dailies' :
              (type == 'todo')   ? 'Todos' :
              (type == 'reward') ? 'Rewards' : null;

          if (type == 'todo') {
              $scope.taskFilter =
              (path == '/todo/active') ? { type: type, completed: false } :
              (path == '/todo/completed') ? { type: type, completed: true } : { type: type };
          }
      });



      $scope.addTask = function() {
          if ( !$scope.newTask.length ) {
              return;
          }

          tasks.push({
              title: $scope.newTask,
              completed: false,
              type: $scope.taskTask
          });

          $scope.newTodo = '';
      };


      $scope.editTodo = function( task ) {
          $scope.editedTask = task;
      };


      $scope.doneEditing = function( task ) {
          $scope.editedTask = null;
          if ( !task.title ) {
              $scope.removeTask(task);
          }
      };


      $scope.removeTodo = function( task ) {
          todos.splice(tasks.indexOf(task), 1);
      };


      $scope.clearDoneTodos = function() {
          $scope.tasks = tasks = tasks.filter(function( val ) {
              return !val.completed;
          });
      };


      $scope.markAll = function( done ) {
          tasks.forEach(function( task ) {
              task.completed = done;
          });
      };
  })

});
