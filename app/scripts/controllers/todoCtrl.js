'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persist the model via the todoStorage service
 * - exposes the model to the template and provides event handlers
 */
habitrpg.controller( 'TodoCtrl', function TodoCtrl( $scope, $location, todoStorage, filterFilter ) {
  var todos = $scope.todos = todoStorage.get();

  $scope.newTodo = "";
  $scope.editedTodo = null;

  $scope.$watch('todos', function() {
    $scope.remainingCount = filterFilter(todos, {completed: false}).length;
    $scope.doneCount = todos.length - $scope.remainingCount;
    $scope.allChecked = !$scope.remainingCount
    todoStorage.put(todos);
  }, true);

  if ( $location.path() === '' ) $location.path('/');
  $scope.location = $location;

  $scope.$watch( 'location.path()', function( path ) {
    var type = $scope.taskType = path.split('/')[1];
    $scope.taskFilter = { type: type }
    $scope.taskTypeTitle =
        (type == 'habit') ? 'Habits' :
        (type == 'daily') ? 'Dailies' :
        (type == 'todo') ? 'Todos' :
        (type == 'reward') ? 'Rewards' : null;
    if (type == 'todo') {
        $scope.taskFilter =
            (path == '/todo/active') ? { type: type, completed: false } :
            (path == '/todo/completed') ? { type: type, completed: true } : { type: type };
    }
  });

  $scope.addTodo = function() {
    if ( !$scope.newTodo.length ) {
      return;
    }

    todos.push({
      title: $scope.newTodo,
      completed: false,
      type: $scope.taskType
    });

    $scope.newTodo = '';
  };


  $scope.editTodo = function( todo ) {
    $scope.editedTodo = todo;
  };


  $scope.doneEditing = function( todo ) {
    $scope.editedTodo = null;
    if ( !todo.title ) {
      $scope.removeTodo(todo);
    }
  };


  $scope.removeTodo = function( todo ) {
    todos.splice(todos.indexOf(todo), 1);
  };


  $scope.clearDoneTodos = function() {
    $scope.todos = todos = todos.filter(function( val ) {
      return !val.completed;
    });
  };


  $scope.markAll = function( done ) {
    todos.forEach(function( todo ) {
      todo.completed = done;
    });
  };
});
