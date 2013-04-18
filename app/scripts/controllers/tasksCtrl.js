'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persist the model via the todoStorage service
 * - exposes the model to the template and provides event handlers
 */
habitrpg.controller( 'TasksCtrl', function TasksCtrl( $scope, $rootScope, $location, filterFilter, User, Algos) {

  $scope.newTask = "";
  $rootScope.selectedTask = null; // FIXME is there a way to pass an object into another controller without rootScope?

  User.get(function(user){
      $scope.tasks = user.tasks;

      $scope.$watch('tasks', function() {
          $scope.remainingCount = filterFilter($scope.tasks, {completed: false}).length;
          $scope.doneCount = $scope.tasks.length - $scope.remainingCount;
          $scope.allChecked = !$scope.remainingCount
      }, true);

      if ( $location.path() === '' ) $location.path('/');
      $scope.location = $location;

      $scope.$watch( 'location.path()', function( path ) {
          var type = $scope.taskType = path.split('/')[1];
          $scope.taskFilter = function(task){
              return task.type === type && !task.del;
          }
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

      $scope.score = function(task, direction) {
          Algos.score(user, task.id, direction);
          User.save()
      }

      $scope.addTask = function() {
          if ( !$scope.newTask.length ) {
              return;
          }

          var defaults = {
                text: $scope.newTask,
                type: $scope.taskType,
                value: 0
              },
              extra = {};

          switch($scope.taskType) {
              case 'habit':
                  extra = {up:true, down:true}
                  break;
              case 'daily':
              case 'todo':
                  extra = {completed:false}
                  break;
          }

          $scope.tasks.push(_.defaults(extra, defaults));
          $scope.newTask = '';

          User.save();
      };

      $scope.clearDoneTodos = function() {
          $scope.tasks = $scope.tasks.filter(function( val ) {
              return !val.completed;
          });
      };

      $scope.selectTask = function(task) {
          $rootScope.selectedTask = task;
          $location.path('/tasks/' + task.id)
      }

  })

});
